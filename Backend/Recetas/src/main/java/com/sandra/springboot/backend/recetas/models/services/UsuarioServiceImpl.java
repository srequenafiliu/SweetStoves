package com.sandra.springboot.backend.recetas.models.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.sandra.springboot.backend.recetas.models.dto.UsuarioDto;
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
	public Usuario login(Usuario user) throws NoSuchAlgorithmException {
		return usuario.findByUsuarioAndPassword(user.getUsuario(), encodePassword(user.getPassword()))
				.orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario y/o contraseña no válidos"));
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
	public Usuario save(Usuario usuarioNew) throws NoSuchAlgorithmException {
		usuarioNew.setPassword(encodePassword(usuarioNew.getPassword()));
		return usuario.save(usuarioNew);
	}
	
	@Override
	public Usuario findByUsuario(UsuarioDto user) throws NoSuchAlgorithmException {
		return usuario.findByUsuario(user.getUsuario()).orElse(null);
	}

	@Override
	public Usuario findByUsuarioAndPassword(UsuarioDto user) throws NoSuchAlgorithmException {
		return usuario.findByUsuarioAndPassword(user.getUsuario(), encodePassword(user.getPassword())).orElse(null);
	}
	
	@Override
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
