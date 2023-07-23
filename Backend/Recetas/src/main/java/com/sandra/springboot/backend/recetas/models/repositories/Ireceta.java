package com.sandra.springboot.backend.recetas.models.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.models.entity.Usuario;

@Repository
public interface Ireceta extends JpaRepository<Receta, Integer> {
	Page<Receta> findAllByNombreContainsIgnoreCaseAndTipoContainsIgnoreCaseAndNeedsContainsAndDificultadIn(String nombre, String tipo, String needs, List<Integer> dificultad, Pageable pageable);
	Page<Receta> findAllByNombreContainsIgnoreCaseAndTipoContainsIgnoreCaseAndNeedsContainsAndDificultadInAndUsuariosIn(String nombre, String tipo, String needs, List<Integer> dificultad, List<Usuario> usuarios, Pageable pageable);
}
