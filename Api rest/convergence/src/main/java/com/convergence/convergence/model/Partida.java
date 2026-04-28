package com.convergence.convergence.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    @Column(name = "jugadores_actual")
    private int jugadoresActual;
    @Column(name = "jugadores_limite")
    private int jugadoresLimite;
    private String estado;
    private int ronda;
    private int fase;
    @Column(name = "host_id")
    private Long hostId;


    public Partida() {}

    public Partida(String nombre, int jugadoresActual, int jugadoresLimite, String estado, int ronda, int fase,
            Long hostId) {
        this.nombre = nombre;
        this.jugadoresActual = jugadoresActual;
        this.jugadoresLimite = jugadoresLimite;
        this.estado = estado;
        this.ronda = ronda;
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

    public int getJugadoresActual() {
        return jugadoresActual;
    }

    public void setJugadoresActual(int jugadoresActual) {
        this.jugadoresActual = jugadoresActual;
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

    public int getRonda() {
        return ronda;
    }

    public void setRonda(int ronda) {
        this.ronda = ronda;
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
    
}
