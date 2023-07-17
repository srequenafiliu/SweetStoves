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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
	
	@GetMapping("")
	public ResponseEntity<?> index(@RequestParam(name="pag", defaultValue = "1") Integer pag,
			@RequestParam(name="size", defaultValue = "6") Integer size) {
		Map<String,Object> response = new TreeMap<>();
		try {
			Pageable pageable = PageRequest.of(pag-1, size, Sort.by("id").ascending());
			Page<Usuario> page = usuarioService.findAll(pageable);
			response.put("previous", (page.isFirst()) ? null : ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag-1).toUriString());
			response.put("next", (page.isLast()) ? null : ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag+1).toUriString());
			response.put("count", page.getTotalElements());
			List<Usuario> listaUsuarios = page.getContent()
					.stream()
					.map(u -> {
						Usuario usuario = new Usuario(u);
						if(usuario.getImagen()!=null)
							usuario.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + usuario.getImagen());
						return usuario;
					})
					.collect(Collectors.toList());
			response.put("result", listaUsuarios);
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
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
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@Valid @RequestBody Usuario usuario, BindingResult result, @PathVariable int id) throws NoSuchAlgorithmException{
		Usuario usuarioActual = null;
		Usuario usuarioUpdated = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors()) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
			response.put("errores", errors);
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
		else if (!usuarioService.samePassword(usuarioActual.getPassword(), usuario.getPassword())) {
			response.put("mensaje", "Error al comprobar la contraseña");
			response.put("error", "Contraseña incorrecta");
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.UNAUTHORIZED);
		}
		// Si llegamos aquí es que el usuario que queremos modificar SI existe
		try {
			usuarioActual.setUsuario(usuario.getUsuario());
			usuarioActual.setCorreo(usuario.getCorreo().toLowerCase());
			usuarioActual.setPassword(usuario.getPassword());
			if(usuario.getImagen()!=null) {
				if (usuarioActual.getImagen()!=null) imageUtils.deleteImage("public", usuarioActual.getImagen());
				if (usuario.getImagen().equals("borrar")) usuarioActual.setImagen(null);
				else {
					String ruta = imageUtils.saveImageBase64("usuarios", usuario.getImagen());
					usuarioActual.setImagen(ruta);
				}
			}
			usuarioActual.getDatosUsuario().setNombre(usuario.getDatosUsuario().getNombre());
			usuarioActual.getDatosUsuario().setApellido(usuario.getDatosUsuario().getApellido());
			usuarioActual.getDatosUsuario().setTelefono(usuario.getDatosUsuario().getTelefono());
			usuarioActual.setRecetas(usuario.getRecetas());
			usuarioActual.setRecetas_seguidas(usuario.getRecetas_seguidas());
			usuarioUpdated = usuarioService.save(usuarioActual);
			if(usuarioUpdated.getImagen()!=null)
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
