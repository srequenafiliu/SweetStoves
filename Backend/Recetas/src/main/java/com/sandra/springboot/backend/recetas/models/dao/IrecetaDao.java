package com.sandra.springboot.backend.recetas.models.dao;

import org.springframework.data.repository.CrudRepository;

import com.sandra.springboot.backend.recetas.models.entity.Receta;

public interface IrecetaDao extends CrudRepository<Receta, Integer> {

}
