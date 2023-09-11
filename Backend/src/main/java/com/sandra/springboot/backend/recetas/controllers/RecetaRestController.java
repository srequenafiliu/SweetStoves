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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

import com.sandra.springboot.backend.recetas.models.dto.RecetaDto;
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
	
	private static String getUrl() {
		return ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
	}
	
	@GetMapping("")
	public ResponseEntity<?> index(@RequestParam(name="pag",defaultValue="1")Integer pag, @RequestParam(name="size",defaultValue="4")Integer size,
			@RequestParam(name="sortField",defaultValue="id")String sortField, @RequestParam(name="sortDir",defaultValue="asc") String sortDir,
			@RequestParam(name="nombre",defaultValue="")String name, @RequestParam(name="tipo",defaultValue="")String tipo,
			@RequestParam(name="necesidades",defaultValue="")String needs, @RequestParam(name="dificultad",required=false)Integer dificultad,
			@RequestParam(name="id_usuario", defaultValue = "0") Integer id_usuario) {
		Map<String,Object> response = new TreeMap<String, Object>();
		try {
			List<Integer> range = new ArrayList<>((dificultad==null) ? Arrays.asList(1,2,3,4,5) : Arrays.asList(dificultad));
			Pageable pageable = PageRequest.of(pag-1, size, sortDir.equals("asc") ? Sort.by(sortField).ascending() :
				Sort.by(sortField).descending());
			Page<Receta> page = recetaService.findAllByFilters(name, tipo, needs, range, usuarioService.findById(id_usuario), pageable);
			response.put("previous", (page.isFirst()) ? null : ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag-1)
					.toUriString());
			response.put("next", (page.isLast()) ? null : ServletUriComponentsBuilder.fromCurrentRequest().replaceQueryParam("pag", pag+1)
					.toUriString());
			response.put("count", page.getTotalElements());
			List<RecetaDto> listaRecetas = page.getContent().stream().map(r -> {
				RecetaDto receta = new RecetaDto(r);
				if(receta.getImagen()!=null) receta.setImagen(String.format("%s/%s", getUrl(), receta.getImagen()));
				return receta;
			}).collect(Collectors.toList());
			response.put("result", listaRecetas);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
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
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (NullPointerException e) {
			response.put("mensaje", String.format("La receta con ID %d no existe", id));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		if(receta.getImagen()!=null) receta.setImagen(String.format("%s/%s", getUrl(), receta.getImagen()));
		return new ResponseEntity<Receta>(receta, HttpStatus.OK);
	}
	
	@PostMapping("")
	public ResponseEntity<?> create(@Valid @RequestBody Receta receta, BindingResult result){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Receta recetaNew = null;
		boolean tipo_incorrecto = !new ArrayList<String>(Arrays.asList("Dulce", "Salado")).contains(receta.getTipo());
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors() || tipo_incorrecto) {
			List<String> errors = result.getFieldErrors().stream()
					.map(err -> String.format("El campo '%s' %s", err.getField(), err.getDefaultMessage())).collect(Collectors.toList());
			if (tipo_incorrecto) errors.add("El campo 'tipo' solo puede ser 'Dulce' o 'Salado'");
			response.put("errores", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			receta.setUsuario(usuarioService.findById(Integer.parseInt(auth.getCredentials().toString())));
			if(receta.getImagen()!=null) {
				String ruta = imageUtils.saveImageBase64("recetas", receta.getImagen());
				receta.setImagen(ruta);
			}
			receta.setUsuarios(Set.of(receta.getUsuario()));
			receta.setCreacion(new Date());
			recetaNew = recetaService.save(receta);
			if(receta.getImagen()!=null) recetaNew.setImagen(String.format("%s/%s", getUrl(), recetaNew.getImagen()));
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La receta se ha insertado correctamente");
		response.put("receta", recetaNew);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.CREATED);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@Valid @RequestBody Receta receta, @PathVariable int id, BindingResult result){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Receta recetaActual = null, recetaUpdated = null;
		boolean tipo_incorrecto = !new ArrayList<String>(Arrays.asList("Dulce", "Salado")).contains(receta.getTipo());
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors() || tipo_incorrecto) {
			List<String> errors = result.getFieldErrors().stream()
					.map(err -> String.format("El campo '%s' %s", err.getField(), err.getDefaultMessage())).collect(Collectors.toList());
			if (tipo_incorrecto) errors.add("El campo 'tipo' solo puede ser 'Dulce' o 'Salado'");
			response.put("errores", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			recetaActual = recetaService.findById(id);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(recetaActual==null) {
			response.put("mensaje", String.format("La receta con ID %d no existe en la base de datos", id));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.NOT_FOUND);
		}
		else if (recetaActual.getUsuario().getId() != Integer.parseInt(auth.getCredentials().toString())) {
			response.put("mensaje", "No puedes modificar una receta de otro usuario");
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.UNAUTHORIZED);
		}
		try {
			recetaActual.updateRepice(receta);
			if(receta.getImagen()!=null) {
				imageUtils.deleteImage("public", recetaActual.getImagen());
				String ruta = imageUtils.saveImageBase64("recetas", receta.getImagen());
				recetaActual.setImagen(ruta);
			}
			recetaUpdated = recetaService.save(recetaActual);
			if(recetaUpdated.getImagen()!=null) recetaUpdated.setImagen(String.format("%s/%s", getUrl(), recetaUpdated.getImagen()));
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La receta se ha modificado correctamente");
		response.put("receta", recetaUpdated);
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
	
	@PutMapping("/{id}/seguimiento")
	public ResponseEntity<?> update_seguimiento(@PathVariable int id){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id_usuario = Integer.parseInt(auth.getCredentials().toString());
		Receta receta = null;
		Map<String, Object> response = new HashMap<>();
		try {
			receta = recetaService.findById(id);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}catch (NullPointerException e) {
			response.put("mensaje", String.format("La receta con ID %d no existe en la base de datos", id));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		if (receta.getUsuario().getId() == id_usuario) {
			response.put("mensaje", "No puedes eliminar una receta tuya de tu lista personal");
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.UNAUTHORIZED);
		}
		Set<Usuario> usuarios = receta.getUsuarios();
		boolean receta_guardada = usuarios.stream().anyMatch(u -> u.getId() == Integer.parseInt(auth.getCredentials().toString()));
		try {
			if (receta_guardada) receta.setUsuarios(usuarios.stream().filter(u -> u.getId() != id_usuario).collect(Collectors.toSet()));
			else {
				usuarios.add(usuarioService.findById(id_usuario));
				receta.setUsuarios(usuarios);
			};
			recetaService.save(receta);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", String.format("La receta se ha %s correctamente %s tu lista personal de recetas",
				receta_guardada ? "eliminado": "añadido", receta_guardada ? "de": "en"));
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable int id){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Map<String,Object> response = new HashMap<>();
		Receta receta = null;
		try {
			receta = recetaService.findById(id);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (receta == null) {
			response.put("mensaje", "Error al eliminar la receta");
			response.put("error", String.format("La receta con ID %d no existe", id));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		else if (receta.getUsuario().getId() != Integer.parseInt(auth.getCredentials().toString())) {
			response.put("mensaje", "No puedes eliminar una receta de otro usuario");
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.UNAUTHORIZED);
		}
		try {
			recetaService.delete(id);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al eliminar la receta");
			response.put("error", String.format("%s: %s",  e.getMessage(), e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La receta se ha borrado correctamente");
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
	}
}