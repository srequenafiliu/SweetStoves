package com.sandra.springboot.backend.recetas.models.services;

import java.util.List;

import com.sandra.springboot.backend.recetas.models.entity.Receta;

public interface IrecetaService {
	
	public List<Receta> findAll();
	public Receta findById(int id);
	public void delete(int id);
	public Receta save(Receta receta);
}
