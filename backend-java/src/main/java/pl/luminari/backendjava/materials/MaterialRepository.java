package pl.luminari.backendjava.materials;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findBySubtopicIdOrderByIdAsc(Long subtopicId);
    void deleteBySubtopicId(Long subtopicId);
}
