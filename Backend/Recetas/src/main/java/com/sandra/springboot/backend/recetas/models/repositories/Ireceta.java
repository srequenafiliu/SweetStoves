package com.sandra.springboot.backend.recetas.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sandra.springboot.backend.recetas.models.entity.Receta;

@Repository
public interface Ireceta extends JpaRepository<Receta, Integer> {

}