package com.sandra.springboot.backend.recetas.models.services;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;

public interface IusuarioService {
	
	public List<Usuario> findAll();
	public Usuario findById(int id);
	public Usuario login(Usuario user) throws NoSuchAlgorithmException;
	public void delete(int id);
	public Usuario save(Usuario usuario) throws NoSuchAlgorithmException;
}
