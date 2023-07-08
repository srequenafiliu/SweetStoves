package com.sandra.springboot.backend.recetas.models.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.models.repositories.Ireceta;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

@Service
public class RecetaService {
	
	@Autowired
	private Ireceta receta;

	private final ImageUtils imageUtils = new ImageUtils();
	
	@Transactional(readOnly = true)
	public Page<Receta> findAll(int pag, int size, String sortField, String sortDir) {
		return receta.findAll(PageRequest.of(pag, size, sortDir.equals("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending()));
	}
	
	@Transactional(readOnly = true)
	public Page<Receta> findAllByFilters(String nombre, String tipo, String needs, List<Integer> dificultad, Pageable pageable) {
		return receta.findAllByNombreContainsIgnoreCaseAndTipoContainsIgnoreCaseAndNeedsContainsAndDificultadIn(nombre, tipo, needs, dificultad, pageable);
	}

	@Transactional(readOnly = true)
	public Receta findById(int id) {
		return receta.findById(id).orElse(null);
	}

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

	public Receta save(Receta recetaNew) {
		return receta.save(recetaNew);
	}

}
