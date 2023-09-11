package com.sandra.springboot.backend.recetas.models.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;

public interface Iusuario extends JpaRepository<Usuario, Integer> {
	
	Optional<Usuario> findByUsuarioAndPassword(String usuario, String password);

}