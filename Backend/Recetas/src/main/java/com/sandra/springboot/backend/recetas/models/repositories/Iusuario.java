package com.sandra.springboot.backend.recetas.models.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;

@Repository
public interface Iusuario extends JpaRepository<Usuario, Integer> {
	
	Optional<Usuario> findByUsuario(String usuario);
	Optional<Usuario> findByUsuarioAndPassword(String usuario, String password);

}
