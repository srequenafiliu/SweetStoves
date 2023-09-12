package com.sandra.springboot.backend.recetas.controllers;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sandra.springboot.backend.recetas.models.dto.UsuarioDto;
import com.sandra.springboot.backend.recetas.models.entity.Usuario;
import com.sandra.springboot.backend.recetas.models.services.UsuarioService;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

import jakarta.validation.Valid;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/usuarios")
public class UsuarioRestController {
	
	private final ImageUtils imageUtils = new ImageUtils();
	
	@Autowired
	private UsuarioService usuarioService;
	
	private static String getUrl() {
		return ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
	}
	
	@GetMapping("")
	public ResponseEntity<?> index(@RequestParam(name="pag",defaultValue="1")Integer pag,@RequestParam(name="size",defaultValue="6") Integer size){
		Map<String,Object> response = new TreeMap<>();
		try {
			Pageable pageable = PageRequest.of(pag-1, size, Sort.by("id").ascending());
			Page<Usuario> page = usuarioService.findAll(pageable);
			response.put("previous", (page.isFirst()) ? null :
				ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag-1).toUriString());
			response.put("next", (page.isLast()) ? null :
				ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag+1).toUriString());
			response.put("count", page.getTotalElements());
			List<UsuarioDto> listaUsuarios = page.getContent().stream().map(u -> {
				UsuarioDto usuarioDto = new UsuarioDto(u);
				if(usuarioDto.getImagen()!=null) usuarioDto.setImagen(String.format("%s/%s", getUrl(), usuarioDto.getImagen()));
				return usuarioDto;
			}).collect(Collectors.toList());
			response.put("result", listaUsuarios);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s", e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
	
	@GetMapping("/logged")
	public ResponseEntity<?> show() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		int id_usuario = Integer.parseInt(auth.getCredentials().toString());
		Usuario usuario = null;
		Map<String, Object> response = new HashMap<>();
		try {
			usuario = usuarioService.findById(Integer.parseInt(auth.getCredentials().toString()));
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s", e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(usuario == null) {
			response.put("mensaje", String.format("El usuario con ID %d no existe", id_usuario));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.UNAUTHORIZED);
		}
		if(usuario.getImagen()!=null) usuario.setImagen(String.format("%s/%s", getUrl(), usuario.getImagen()));
		return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);
	}
	
	@PutMapping("/logged")
	public ResponseEntity<?> update(@Valid @RequestBody Usuario usuario, BindingResult result) throws NoSuchAlgorithmException{
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		int id_usuario = Integer.parseInt(auth.getCredentials().toString());
		Usuario usuarioActual = null, usuarioUpdated = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors()) {
			List<String> errors = result.getFieldErrors().stream()
					.map(err -> String.format("El campo '%s' %s", err.getField(), err.getDefaultMessage())).collect(Collectors.toList());
			response.put("errores", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			usuarioActual = usuarioService.findById(id_usuario);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s", e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(usuarioActual == null) {
			response.put("mensaje", "Error al actualizar el usuario");
			response.put("error", String.format("El usuario con ID %d no existe en la base de datos", id_usuario));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.UNAUTHORIZED);
		}
		else if (!usuarioService.samePassword(usuarioActual.getPassword(), usuario.getPassword())) {
			response.put("mensaje", "Error al comprobar la contraseña");
			response.put("error", "Contraseña incorrecta");
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.UNAUTHORIZED);
		}
		try {
			usuarioActual.updateUser(usuario);
			if (usuario.getImagen() != null) {
				if (usuarioActual.getImagen() != null) imageUtils.deleteImage("public", usuarioActual.getImagen());
				if (usuario.getImagen().equals("borrar")) usuarioActual.setImagen(null);
				else {
					String ruta = imageUtils.saveImageBase64("usuarios", usuario.getImagen());
					usuarioActual.setImagen(ruta);
				}
			}
			usuarioUpdated = usuarioService.save(usuarioActual);
			if(usuarioUpdated.getImagen()!=null) usuarioUpdated.setImagen(String.format("%s/%s", getUrl(), usuarioUpdated.getImagen()));
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s", e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "El usuario se ha modificado correctamente");
		response.put("usuario", usuarioUpdated);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
	
	@DeleteMapping("/logged")
	public ResponseEntity<?> delete(){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		int id_usuario = Integer.parseInt(auth.getCredentials().toString());
		Map<String,Object> response = new HashMap<>();
		if (usuarioService.findById(id_usuario) == null) {
			response.put("mensaje", "Error al eliminar el usuario");
			response.put("error", String.format("El usuario con ID %d no existe", id_usuario));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		try {
			usuarioService.delete(id_usuario);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al eliminar el usuario");
			response.put("error", String.format("%s: %s", e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "El usuario se ha borrado correctamente");
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.NO_CONTENT);
	}
}
