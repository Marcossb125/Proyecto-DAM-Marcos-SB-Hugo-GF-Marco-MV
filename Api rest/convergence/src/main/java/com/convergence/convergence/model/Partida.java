package com.convergence.convergence.model;

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
    private int jugadores_actual;
    private int jugadores_limite;
    private String estado;
    private int ronda;
    private int fase;
    private Long host_id;


    public Partida() {}

    public Partida(String nombre, int jugadores_actual, int jugadores_limite, String estado, int ronda, int fase,
            Long host_id) {
        this.nombre = nombre;
        this.jugadores_actual = jugadores_actual;
        this.jugadores_limite = jugadores_limite;
        this.estado = estado;
        this.ronda = ronda;
        this.fase = fase;
        this.host_id = host_id;
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

    public int getJugadores_actual() {
        return jugadores_actual;
    }

    public void setJugadores_actual(int jugadores_actual) {
        this.jugadores_actual = jugadores_actual;
    }

    public int getJugadores_limite() {
        return jugadores_limite;
    }

    public void setJugadores_limite(int jugadores_limite) {
        this.jugadores_limite = jugadores_limite;
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

    public Long getHost_id() {
        return host_id;
    }

    public void setHost_id(Long host_id) {
        this.host_id = host_id;
    }
    
}
