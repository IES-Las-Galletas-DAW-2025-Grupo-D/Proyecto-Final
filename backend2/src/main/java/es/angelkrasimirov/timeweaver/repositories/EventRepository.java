package es.angelkrasimirov.timeweaver.repositories;

import es.angelkrasimirov.timeweaver.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByProjectId(Long projectId);
}
