package com.sandra.springboot.backend.recetas.models.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sandra.springboot.backend.recetas.models.dto.UsuarioDto;
import com.sandra.springboot.backend.recetas.models.entity.Usuario;
import com.sandra.springboot.backend.recetas.models.repositories.Iusuario;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

@Service
public class UsuarioService {
	
	@Autowired
	private Iusuario usuario;
	
	private final ImageUtils imageUtils = new ImageUtils();
	
	@Transactional(readOnly = true)
	public Page<Usuario> findAll(Pageable pageable) {
		return usuario.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public Usuario findById(int id) {
		return usuario.findById(id).orElse(null);
	}

	public void delete(int id) {
		Usuario usuarioActual = usuario.findById(id).orElse(null);
		if(usuarioActual!=null) {
			if(usuarioActual.getImagen()!=null) {
				// borrado del fichero de la imagen
				imageUtils.deleteImage("public", usuarioActual.getImagen());
			}
			usuarioActual.getRecetas().forEach(r->{if(r.getImagen() != null) imageUtils.deleteImage("public", r.getImagen());});
		usuario.deleteById(id);
		}
	}

	public Usuario save(Usuario usuarioNew) throws NoSuchAlgorithmException {
		usuarioNew.setPassword(encodePassword(usuarioNew.getPassword()));
		return usuario.save(usuarioNew);
	}
	
	public Usuario findByUsuario(UsuarioDto user) throws NoSuchAlgorithmException {
		return usuario.findByUsuario(user.getUsuario()).orElse(null);
	}

	public Usuario findByUsuarioAndPassword(String user, String password) throws NoSuchAlgorithmException {
		return usuario.findByUsuarioAndPassword(user, encodePassword(password)).orElse(null);
	}
	
	public boolean samePassword(String saved_pass, String password) throws NoSuchAlgorithmException {
		return saved_pass.equals(encodePassword(password));
	}
	
	private String encodePassword(String pass) throws NoSuchAlgorithmException{
		MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(pass.getBytes(StandardCharsets.UTF_8));
        String encodedPass = Base64.getEncoder().encodeToString(hash);
        return encodedPass;
	}

}