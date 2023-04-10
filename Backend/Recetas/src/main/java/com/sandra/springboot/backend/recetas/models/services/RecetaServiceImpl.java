package com.sandra.springboot.backend.recetas.models.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sandra.springboot.backend.recetas.models.dao.IrecetaDao;
import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

@Service
public class RecetaServiceImpl implements IrecetaService {
	
	@Autowired
	private IrecetaDao recetaDao;

	private final ImageUtils imageUtils = new ImageUtils();
	
	@Override
	@Transactional(readOnly = true)
	public List<Receta> findAll() {
		return (List<Receta>) recetaDao.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Receta findById(int id) {
		return recetaDao.findById(id).orElse(null);
	}

	@Override
	public void delete(int id) {
		Receta recetaActual = recetaDao.findById(id).orElse(null);
		if(recetaActual!=null) {
			if(recetaActual.getImagen()!=null) {
				// borrado del fichero de la imagen
				imageUtils.deleteImage("public", recetaActual.getImagen());
			}
			recetaDao.deleteById(id);
		}
	}

	@Override
	public Receta save(Receta receta) {
		if(receta.getImagen()!=null) {
			String ruta = imageUtils.saveImageBase64("recetas", receta.getImagen());
			receta.setImagen(ruta);
		}
		return recetaDao.save(receta);
	}

}
