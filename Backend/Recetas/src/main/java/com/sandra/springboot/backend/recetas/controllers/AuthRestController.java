package com.sandra.springboot.backend.recetas.controllers;

import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.sandra.springboot.backend.recetas.models.dto.UsuarioDto;
import com.sandra.springboot.backend.recetas.models.entity.Usuario;
import com.sandra.springboot.backend.recetas.models.services.UsuarioService;
import com.sandra.springboot.backend.recetas.utilidades.ImageUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

@RequiredArgsConstructor
@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/auth")
public class AuthRestController {
	
	private final ImageUtils imageUtils = new ImageUtils();

	@Autowired
	private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Usuario usuario) throws NoSuchAlgorithmException {
		Map<String,Object> response = new HashMap<>();
        Usuario u = usuarioService.findByUsuarioAndPassword(usuario.getUsuario(), usuario.getPassword());
		if(u==null) {
			response.put("error", "Usuario y/o contraseña no válidos");
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.UNAUTHORIZED);
		}
		response.put("accessToken", getToken(u));
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.OK);
    }

    @PostMapping("/registro")
	public ResponseEntity<?> create(@Valid @RequestBody Usuario usuario, BindingResult result) throws NoSuchAlgorithmException{
		Usuario usuarioNew = null;
		Map<String,Object> response = new HashMap<>();
		if(result.hasErrors() || !usuario.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$")) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map(err -> "El campo '" + err.getField() +"' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
			if (!usuario.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
				errors.add("El campo 'password' no tiene el formato correcto");
			response.put("errores", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		try {
			if(usuario.getImagen()!=null) {
				String ruta = imageUtils.saveImageBase64("usuarios", usuario.getImagen());
				usuario.setImagen(ruta);
			}
			usuario.getDatosUsuario().setUsuario(usuario);
			usuario.setCorreo(usuario.getCorreo().toLowerCase());
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
	
	@PutMapping("/change_password")
	public ResponseEntity<?> changePassword(@Valid @RequestBody UsuarioDto usuario, BindingResult result) throws NoSuchAlgorithmException{
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
			if(usuarioService.findByUsuario(usuario)==null) { // El usuario no existe en la base de datos
				response.put("error", "El usuario '"+usuario.getUsuario()+"' no existe");
				return new ResponseEntity<Map<String,Object>>(response,HttpStatus.NOT_FOUND);
			}
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		try {
			usuarioActual = usuarioService.findByUsuarioAndPassword(usuario.getUsuario(), usuario.getPassword());
			// Comprueba si la contraseña coincide con la guardada en la base de datos
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(usuarioActual==null) { // No existe en la base de datos
			response.put("error", "Contraseña actual incorrecta");
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.NOT_FOUND);
		}
		// Si llegamos aquí es que el usuario que queremos modificar SI existe
		try {
			usuarioActual.setPassword(usuario.getNew_password());
			usuarioUpdated = usuarioService.save(usuarioActual);
		} catch (DataAccessException e) {  // Error al acceder a la base de datos
			response.put("mensaje", "Error al conectar con la base de datos");
			response.put("error", e.getMessage().concat(":")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String,Object>>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("mensaje", "La contraseña se ha modificado correctamente");
		response.put("password", usuarioUpdated.getPassword());
		return new ResponseEntity<Map<String,Object>>(response,HttpStatus.CREATED);
	}

    private String getToken(Usuario user) {
        Algorithm algorithm = Algorithm.HMAC256("token113");
        String token = JWT.create()
                .withIssuer("srequenafiliu")
                .withClaim("id", user.getId())
                .withIssuedAt(new Date(System.currentTimeMillis()))
                // .withExpiresAt(new Date(System.currentTimeMillis() + (24*3600*1000))) Caducaría en un día
                .sign(algorithm);
        return token;
    }

}
