package com.sandra.springboot.backend.recetas.models.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.models.repositories.Ireceta;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

@Service
public class RecetaServiceImpl implements IrecetaService {
	
	@Autowired
	private Ireceta receta;

	private final ImageUtils imageUtils = new ImageUtils();
	
	@Override
	@Transactional(readOnly = true)
	public List<Receta> findAll() {
		return (List<Receta>) receta.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Receta findById(int id) {
		return receta.findById(id).orElse(null);
	}

	@Override
	public void delete(int id) {
		Receta recetaActual = receta.findById(id).orElse(null);
		if(recetaActual!=null) {
			if(recetaActual.getImagen()!=null) {
				// borrado del fichero de la imagen
				imageUtils.deleteImage("public", recetaActual.getImagen());
			}
			receta.deleteById(id);
		}
	}

	@Override
	public Receta save(Receta recetaNew) {
		return receta.save(recetaNew);
	}

}
