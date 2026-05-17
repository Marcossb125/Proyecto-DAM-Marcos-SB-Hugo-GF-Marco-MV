package com.convergence.convergence.service;

import com.convergence.convergence.model.MatchSnapshot;
import com.convergence.convergence.model.Partida;
import com.convergence.convergence.model.User;
import com.convergence.convergence.model.mongodb.MatchSnapshotMongo;
import com.convergence.convergence.model.mongodb.PartidaMongo;
import com.convergence.convergence.model.mongodb.UsuarioMongo;
import com.convergence.convergence.repository.MatchSnapshotRepository;
import com.convergence.convergence.repository.PartidaRepository;
import com.convergence.convergence.repository.UserRepository;
import com.convergence.convergence.repository.mongodb.MatchSnapshotMongoRepository;
import com.convergence.convergence.repository.mongodb.PartidaMongoRepository;
import com.convergence.convergence.repository.mongodb.UsuarioMongoRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoSyncService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private MatchSnapshotRepository matchSnapshotRepository;

    @Autowired
    private UsuarioMongoRepository usuarioMongoRepository;

    @Autowired
    private PartidaMongoRepository partidaMongoRepository;

    @Autowired
    private MatchSnapshotMongoRepository matchSnapshotMongoRepository;

    @PostConstruct
    public void init() {
        try {
            System.out.println("[MongoSync] Iniciando volcado automático SQL → MongoDB...");
            SyncResult result = syncAll();
            System.out.println("[MongoSync] Volcado completado: " +
                result.usuariosSincronizados + " usuarios, " +
                result.partidasSincronizadas + " partidas, " +
                result.snapshotsSincronizados + " snapshots");
        } catch (Exception e) {
            System.err.println("[MongoSync] Error en volcado automático: " + e.getMessage());
        }
    }

    public SyncResult syncAll() {
        int usuarios = syncAllUsuarios();
        int partidas = syncAllPartidas();
        int snapshots = syncAllMatchSnapshots();
        return new SyncResult(usuarios, partidas, snapshots);
    }

    public int syncAllUsuarios() {
        List<User> users = userRepository.findAll();
        int count = 0;
        for (User user : users) {
            try {
                syncUsuario(user);
                count++;
            } catch (Exception e) {
                System.err.println("[MongoSync] Error sincronizando usuario " + user.getNickname() + ": " + e.getMessage());
            }
        }
        System.out.println("[MongoSync] Usuarios sincronizados: " + count + "/" + users.size());
        return count;
    }

    public void syncUsuario(User user) {
        UsuarioMongo mongo = usuarioMongoRepository.findById(user.getNickname()).orElse(null);
        if (mongo == null) {
            mongo = new UsuarioMongo();
            mongo.setId(user.getNickname());
            mongo.setVictorias(0);
        }
        mongo.setIdGeneral(user.getGeneralId() != null ? user.getGeneralId().intValue() : 0);
        mongo.setBandera(user.getBandera());
        mongo.setFaccion(user.getFaccion());
        usuarioMongoRepository.save(mongo);
    }

    public int syncAllPartidas() {
        List<Partida> partidas = partidaRepository.findAll();
        int count = 0;
        for (Partida partida : partidas) {
            try {
                syncPartida(partida);
                count++;
            } catch (Exception e) {
                System.err.println("[MongoSync] Error sincronizando partida " + partida.getId() + ": " + e.getMessage());
            }
        }
        System.out.println("[MongoSync] Partidas sincronizadas: " + count + "/" + partidas.size());
        return count;
    }

    public void syncPartida(Partida partida) {
        String mongoId = partida.getId().toString();
        PartidaMongo existing = partidaMongoRepository.findById(mongoId).orElse(null);
        String previousWinner = existing != null ? existing.getIdGanador() : null;

        final PartidaMongo mongo;
        if (existing == null) {
            mongo = new PartidaMongo();
            mongo.setId(mongoId);
        } else {
            mongo = existing;
        }

        userRepository.findById(partida.getHostId()).ifPresent(host -> mongo.setIdHost(host.getNickname()));

        if (partida.getIdGanador() != null) {
            userRepository.findById(partida.getIdGanador()).ifPresent(winner ->
                mongo.setIdGanador(winner.getNickname())
            );
        }
        partidaMongoRepository.save(mongo);

        // Si hay un nuevo ganador, incrementar sus victorias en MongoDB
        if (mongo.getIdGanador() != null && !mongo.getIdGanador().equals(previousWinner)) {
            usuarioMongoRepository.findById(mongo.getIdGanador()).ifPresent(usuarioMongo -> {
                int victoriasActuales = usuarioMongo.getVictorias() != null ? usuarioMongo.getVictorias() : 0;
                usuarioMongo.setVictorias(victoriasActuales + 1);
                usuarioMongoRepository.save(usuarioMongo);
            });
        }
    }

    public int syncAllMatchSnapshots() {
        List<MatchSnapshot> snapshots = matchSnapshotRepository.findAll();
        int count = 0;
        for (MatchSnapshot snapshot : snapshots) {
            try {
                syncMatchSnapshot(snapshot);
                count++;
            } catch (Exception e) {
                System.err.println("[MongoSync] Error sincronizando snapshot " + snapshot.getId() + ": " + e.getMessage());
            }
        }
        System.out.println("[MongoSync] Snapshots sincronizados: " + count + "/" + snapshots.size());
        return count;
    }

    public void syncMatchSnapshot(MatchSnapshot snapshot) {
        String mongoId = snapshot.getId().toString();
        MatchSnapshotMongo mongo = matchSnapshotMongoRepository.findById(mongoId).orElse(null);
        if (mongo == null) {
            mongo = new MatchSnapshotMongo();
            mongo.setId(mongoId);
        }
        mongo.setMatchId(snapshot.getMatchId());
        mongo.setRonda(snapshot.getRonda());
        mongo.setStateJson(snapshot.getStateJson());
        mongo.setTimestamp(snapshot.getTimestamp());
        matchSnapshotMongoRepository.save(mongo);
    }

    public static class SyncResult {
        public int usuariosSincronizados;
        public int partidasSincronizadas;
        public int snapshotsSincronizados;

        public SyncResult(int usuarios, int partidas, int snapshots) {
            this.usuariosSincronizados = usuarios;
            this.partidasSincronizadas = partidas;
            this.snapshotsSincronizados = snapshots;
        }
    }
}
