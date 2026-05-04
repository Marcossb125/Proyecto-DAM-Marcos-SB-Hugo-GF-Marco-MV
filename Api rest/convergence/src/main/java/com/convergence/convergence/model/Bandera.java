package com.convergence.convergence.model;

import java.util.List;

/**
 * POJO que representa los datos de la bandera de un usuario.
 * No es una @Entity JPA porque se almacena como JSON dentro de la columna
 * "Bandera" de la tabla "usuarios". La conversión JSON ↔ objeto la maneja
 * el BanderaConverter (JPA AttributeConverter).
 */
public class Bandera {

    private String layout;
    private List<String> colors;

    public Bandera() {}

    public Bandera(String layout, List<String> colors) {
        this.layout = layout;
        this.colors = colors;
    }

    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }
}
