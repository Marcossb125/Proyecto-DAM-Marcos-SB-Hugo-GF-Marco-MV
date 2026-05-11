package com.convergence.convergence.model.mongodb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "usuarios")
public class UsuarioMongo {
    @Id
    private String id; // This will be the nickname

    @Field("Id_general")
    private Integer idGeneral;

    private Integer victorias;
}
