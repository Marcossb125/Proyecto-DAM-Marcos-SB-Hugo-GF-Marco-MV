package com.convergence.convergence.model.mongodb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "partidas")
public class PartidaMongo {
    @Id
    private String id;

    @Field("Id_host")
    private String idHost;

    private Object snapshot;

    @Field("Id_ganador")
    private String idGanador;
}
