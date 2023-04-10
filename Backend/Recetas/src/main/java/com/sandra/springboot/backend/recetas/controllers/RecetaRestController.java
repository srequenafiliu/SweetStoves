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

import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.models.services.IrecetaService;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/recetas")
public class RecetaRestController {
	
	@Autowired
	private IrecetaService recetaService;
	
	@GetMapping("")
	public ResponseEntity<?> index() {
		List<Receta> listaRecetas = new ArrayList<>();
		Map<String,Object> response = new HashMap<>();
		try {
			listaRecetas = recetaService.findAll()
					.stream()
					.map(e -> {
						Receta receta = new Receta(e);
						if(receta.getImagen()!=null)
							receta.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + receta.getImagen());
						return receta;
					})
					.collect(Collectors.toList());
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<List<Receta>>(listaRecetas,HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> show(@PathVariable int id) {
		Receta receta = null;
		Map<String, Object> response = new HashMap<>();
		try {
			receta = recetaService.findById(id);
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (receta==null) {
			response.put("mensaje", "La receta con ID ".concat(Integer.toString(id)).concat(" no existe"));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		if(receta.getImagen()!=null)
			receta.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + receta.getImagen());
		return new ResponseEntity<Receta>(receta, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable int id){
		Map<String,Object> response = new HashMap<>();
		if (recetaService.findById(id)==null) {
			response.put("mensaje", "Error al eliminar la receta");
			response.put("error", "La receta con ID ".concat(Integer.toString(id)).concat(" no existe"));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		try {
			recetaService.delete(id);
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al eliminar la receta");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La receta se ha borrado correctamente");
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
	
	@PostMapping("")
	public ResponseEntity<?> create(@RequestBody Receta receta, BindingResult result){
		Receta recetaNew = null;
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
			recetaNew = recetaService.save(receta);
			if(receta.getImagen()!=null)
				recetaNew.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + recetaNew.getImagen());
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La receta se ha insertado correctamente");
		response.put("receta", recetaNew);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.CREATED);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@RequestBody Receta receta, @PathVariable int id, BindingResult result){
		Receta recetaActual = null;
		Receta recetaUpdated = null;
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
			recetaActual = recetaService.findById(id); // La receta puede existir o no
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(recetaActual==null) { // No existe en la base de datos
			response.put("mensaje", "La receta con ID ".concat(Integer.toString(id)).concat(" no existe en la base de datos"));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.NOT_FOUND);
		}
		// Si llegamos aquí es que el evento que queremos modificar SI existe
		try {
			recetaActual.setNombre(receta.getNombre());
			recetaActual.setTipo(receta.getTipo());
			recetaActual.setNecesidades(receta.getNecesidades());
			recetaActual.setIngredientes(receta.getIngredientes());
			recetaActual.setElaboracion(receta.getElaboracion());
			recetaActual.setDificultad(receta.getDificultad());
			if(receta.getImagen()!=null) recetaActual.setImagen(receta.getImagen());
			recetaUpdated = recetaService.save(recetaActual);
			if(receta.getImagen()!=null)
				recetaUpdated.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + recetaUpdated.getImagen());
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La receta se ha modificado correctamente");
		response.put("receta", recetaUpdated);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.CREATED);
	}
}
