package com.sandra.springboot.backend.recetas.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;
import com.sandra.springboot.backend.recetas.models.services.IusuarioService;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/usuarios")
public class UsuarioRestController {
	
	@Autowired
	private IusuarioService usuarioService;
	
	@GetMapping("")
	public ResponseEntity<?> index() {
		List<Usuario> listaUsuarios = new ArrayList<>();
		Map<String,Object> response = new HashMap<>();
		try {
			listaUsuarios = usuarioService.findAll()
					.stream()
					.map(e -> {
						Usuario usuario = new Usuario(e);
						if(usuario.getImagen()!=null)
							usuario.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + usuario.getImagen());
						return usuario;
					})
					.collect(Collectors.toList());
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<List<Usuario>>(listaUsuarios,HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> show(@PathVariable int id) {
		Usuario usuario = null;
		Map<String, Object> response = new HashMap<>();
		try {
			usuario = usuarioService.findById(id);
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (usuario==null) {
			response.put("mensaje", "El usuario con ID ".concat(Integer.toString(id)).concat(" no existe"));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		if(usuario.getImagen()!=null)
			usuario.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + usuario.getImagen());
		return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable int id){
		Map<String,Object> response = new HashMap<>();
		if (usuarioService.findById(id)==null) {
			response.put("mensaje", "Error al eliminar el usuario");
			response.put("error", "El usuario con ID ".concat(Integer.toString(id)).concat(" no existe"));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		try {
			usuarioService.delete(id);
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al eliminar la receta");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "El usuario se ha borrado correctamente");
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
	
	@PostMapping("")
	public ResponseEntity<?> create(@RequestBody Usuario usuario, BindingResult result){
		Usuario usuarioNew = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors()) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
			response.put("errors", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			if(usuario.getImagen()!=null) {
				String ruta = imageUtils.saveImageBase64("recetas", usuario.getImagen());
				usuario.setImagen(ruta);
			}
			usuarioNew = usuarioService.save(usuario);
			if(usuario.getImagen()!=null)
				usuarioNew.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + usuarioNew.getImagen());
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "El usuario se ha insertado correctamente");
		response.put("usuario", usuarioNew);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.CREATED);
	}
	
	private final ImageUtils imageUtils = new ImageUtils();
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@RequestBody Usuario usuario, @PathVariable int id, BindingResult result){
		Usuario usuarioActual = null;
		Usuario usuarioUpdated = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors()) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
			response.put("errors", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			usuarioActual = usuarioService.findById(id); // El usuario puede existir o no
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(usuarioActual==null) { // No existe en la base de datos
			response.put("mensaje", "El usuario con ID ".concat(Integer.toString(id)).concat(" no existe en la base de datos"));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.NOT_FOUND);
		}
		// Si llegamos aquí es que el usuario que queremos modificar SI existe
		try {
			usuarioActual.setUsuario(usuario.getUsuario());
			usuarioActual.setCorreo(usuario.getCorreo());
			usuarioActual.setPassword(usuario.getPassword());
			if(usuario.getImagen()!=null && usuario.getImagen()!="") {
				usuarioActual.setImagen(usuario.getImagen());
				String ruta = imageUtils.saveImageBase64("usuarios", usuario.getImagen());
				usuario.setImagen(ruta);
			}
			usuarioActual.getDatosUsuario().setNombre(usuario.getDatosUsuario().getNombre());
			usuarioActual.getDatosUsuario().setApellido(usuario.getDatosUsuario().getApellido());
			usuarioActual.getDatosUsuario().setTelefono(usuario.getDatosUsuario().getTelefono());
			usuarioActual.setRecetas(usuario.getRecetas());
			usuarioUpdated = usuarioService.save(usuarioActual);
			if(usuario.getImagen()!=null && usuario.getImagen()!="")
				usuarioUpdated.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + usuarioUpdated.getImagen());
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "El usuario se ha modificado correctamente");
		response.put("usuario", usuarioUpdated);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.CREATED);
	}
}
