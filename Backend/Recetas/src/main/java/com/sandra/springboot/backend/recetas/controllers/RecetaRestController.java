package com.sandra.springboot.backend.recetas.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.models.entity.Usuario;
import com.sandra.springboot.backend.recetas.models.services.RecetaService;
import com.sandra.springboot.backend.recetas.models.services.UsuarioService;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

import jakarta.validation.Valid;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/recetas")
public class RecetaRestController {
	
	private final ImageUtils imageUtils = new ImageUtils();
	
	@Autowired
	private RecetaService recetaService;
	
	@Autowired
	private UsuarioService usuarioService;
	
	@GetMapping("")
	public ResponseEntity<?> index(@RequestParam(name="pag", defaultValue = "1") Integer pag,
			@RequestParam(name="size", defaultValue = "4") Integer size,
			@RequestParam(name="sortField", defaultValue = "id") String sortField,
			@RequestParam(name="sortDir", defaultValue = "asc") String sortDir,
			@RequestParam(name="nombre", defaultValue="") String name,
			@RequestParam(name="tipo", defaultValue = "") String tipo,
			@RequestParam(name="necesidades", defaultValue = "") String needs,
			@RequestParam(name="dificultad", required=false) Integer dificultad,
			@RequestParam(name="id_usuario", defaultValue = "0") Integer id_usuario) {
		Map<String,Object> response = new TreeMap<String, Object>();
		try {
			List<Integer> range = new ArrayList<>((dificultad==null) ? Arrays.asList(1,2,3,4,5) : Arrays.asList(dificultad));
			Pageable pageable = PageRequest.of(pag-1, size, sortDir.equals("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());
			Page<Receta> page = recetaService.findAllByFilters(name, tipo, needs, range, usuarioService.findById(id_usuario), pageable);
			response.put("previous", (page.isFirst()) ? null : ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag-1).toUriString());
			response.put("next", (page.isLast()) ? null : ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag+1).toUriString());
			response.put("count", page.getTotalElements());
			List<Receta> listaRecetas = page.getContent()
					.stream()
					.map(r -> {
						Receta receta = new Receta(r);
						if(receta.getImagen()!=null)
							receta.setImagen(ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + receta.getImagen());
						return receta;
					})
					.collect(Collectors.toList());
			response.put("result", listaRecetas);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
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
	public ResponseEntity<?> create(@Valid @RequestBody Receta receta, BindingResult result){
		Receta recetaNew = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors() || !receta.getTipo().equals("Dulce") && !receta.getTipo().equals("Salado")) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
			if (!receta.getTipo().equals("Dulce") && !receta.getTipo().equals("Salado"))
				errors.add("El campo 'tipo' solo puede ser 'Dulce' o 'Salado'");
			response.put("errores", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			receta.setNeeds("");
			if(receta.getImagen()!=null) {
				String ruta = imageUtils.saveImageBase64("recetas", receta.getImagen());
				receta.setImagen(ruta);
			}
			Set<Usuario> usuarios = receta.getUsuarios();
			usuarios.add(receta.getUsuario());
			receta.setUsuarios(usuarios);
			receta.setCreacion(new Date());
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
	public ResponseEntity<?> update(@Valid @RequestBody Receta receta, @PathVariable int id, BindingResult result){
		Receta recetaActual = null;
		Receta recetaUpdated = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors() || !receta.getTipo().equals("Dulce") && !receta.getTipo().equals("Salado")) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
			if (!receta.getTipo().equals("Dulce") && !receta.getTipo().equals("Salado"))
				errors.add("El campo 'tipo' solo puede ser 'Dulce' o 'Salado'");
			response.put("errores", errors);
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
			receta.setNeeds("");
			recetaActual.setNombre(receta.getNombre());
			recetaActual.setTipo(receta.getTipo());
			recetaActual.setNecesidades(receta.getNecesidades());
			recetaActual.setNeeds("");
			recetaActual.setIngredientes(receta.getIngredientes());
			recetaActual.setElaboracion(receta.getElaboracion());
			recetaActual.setDificultad(receta.getDificultad());
			recetaActual.setUsuarios(receta.getUsuarios());
			if(receta.getImagen()!=null) {
				imageUtils.deleteImage("public", recetaActual.getImagen());
				String ruta = imageUtils.saveImageBase64("recetas", receta.getImagen());
				recetaActual.setImagen(ruta);
			}
			recetaUpdated = recetaService.save(recetaActual);
			if(recetaUpdated.getImagen()!=null)
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
