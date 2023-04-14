package com.sandra.springboot.backend.recetas.models.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;
import com.sandra.springboot.backend.recetas.models.repositories.Iusuario;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

@Service
public class UsuarioServiceImpl implements IusuarioService {
	
	@Autowired
	private Iusuario usuario;
	
	private final ImageUtils imageUtils = new ImageUtils();
	
	@Override
	@Transactional(readOnly = true)
	public List<Usuario> findAll() {
		return (List<Usuario>) usuario.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Usuario findById(int id) {
		return usuario.findById(id).orElse(null);
	}

	@Override
	public void delete(int id) {
		Usuario usuarioActual = usuario.findById(id).orElse(null);
		if(usuarioActual!=null) {
			if(usuarioActual.getImagen()!=null) {
				// borrado del fichero de la imagen
				imageUtils.deleteImage("public", usuarioActual.getImagen());
			}
		usuario.deleteById(id);
		}
	}

	@Override
	public Usuario save(Usuario usuarioNew) {
		if(usuarioNew.getImagen()!=null) {
			String ruta = imageUtils.saveImageBase64("usuarios", usuarioNew.getImagen());
			usuarioNew.setImagen(ruta);
		}
		return usuario.save(usuarioNew);
	}

}
