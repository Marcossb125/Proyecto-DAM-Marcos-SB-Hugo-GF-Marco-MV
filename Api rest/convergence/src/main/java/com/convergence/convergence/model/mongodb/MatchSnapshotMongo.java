package com.convergence.convergence.model.mongodb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "match_snapshots")
public class MatchSnapshotMongo {
    @Id
    private String id;

    @Field("match_id")
    private Long matchId;

    @Field("ronda")
    private Integer ronda;
}
