package com.sandra.springboot.backend.recetas.models.dao;

import org.springframework.data.repository.CrudRepository;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;

public interface IusuarioDao extends CrudRepository<Usuario, Integer> {

}
