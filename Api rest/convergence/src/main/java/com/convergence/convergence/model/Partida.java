package com.convergence.convergence.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "Nombre", nullable = false)
    private String nombre;

    @Column(name = "Jugadores_actuales", nullable = false)
    private int jugadoresActuales = 1;

    @Column(name = "Jugadores_limite", nullable = false)
    private int jugadoresLimite = 2;

    @Column(name = "Estado", nullable = false)
    private String estado = "En curso";

    @Column(name = "Rondas", nullable = false)
    private int rondas = 0;

    @Column(name = "Fase", nullable = false)
    private int fase = 0;

    @Column(name = "Host_id", nullable = false)
    private Long hostId;

    @Transient
    private String hostNombre;


    public Partida() {}

    public Partida(String nombre, int jugadoresActuales, int jugadoresLimite, String estado, int rondas, int fase,
            Long hostId) {
        this.nombre = nombre;
        this.jugadoresActuales = jugadoresActuales;
        this.jugadoresLimite = jugadoresLimite;
        this.estado = estado;
        this.rondas = rondas;
        this.fase = fase;
        this.hostId = hostId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getJugadoresActuales() {
        return jugadoresActuales;
    }

    public void setJugadoresActuales(int jugadoresActuales) {
        this.jugadoresActuales = jugadoresActuales;
    }

    public int getJugadoresLimite() {
        return jugadoresLimite;
    }

    public void setJugadoresLimite(int jugadoresLimite) {
        this.jugadoresLimite = jugadoresLimite;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public int getRondas() {
        return rondas;
    }

    public void setRondas(int rondas) {
        this.rondas = rondas;
    }

    public int getFase() {
        return fase;
    }

    public void setFase(int fase) {
        this.fase = fase;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public String getHostNombre() {
        return hostNombre;
    }

    public void setHostNombre(String hostNombre) {
        this.hostNombre = hostNombre;
    }
    
}
