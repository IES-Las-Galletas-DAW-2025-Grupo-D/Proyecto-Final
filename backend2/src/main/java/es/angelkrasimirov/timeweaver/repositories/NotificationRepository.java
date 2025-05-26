package es.angelkrasimirov.timeweaver.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.angelkrasimirov.timeweaver.models.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUsernameAndReadStatusFalseOrderByTimestampDesc(String username);
}
