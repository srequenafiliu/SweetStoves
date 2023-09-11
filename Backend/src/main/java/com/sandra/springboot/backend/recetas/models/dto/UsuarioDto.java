package com.sandra.springboot.backend.recetas.models.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.sandra.springboot.backend.recetas.models.entity.Usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NonNull;

@Data
public class UsuarioDto implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	@NonNull
	private Integer id;
	@NonNull
	@NotBlank
	private String usuario;
	@NonNull
	@NotBlank
	private String nombre;
	private String imagen;
	private List<String> recetas;

	public UsuarioDto(Usuario u) {
		this.id = u.getId();
		this.usuario = u.getUsuario();
		this.nombre = String.format("%s%s", u.getDatosUsuario().getNombre(),
				u.getDatosUsuario().getApellido() != null ? " "+u.getDatosUsuario().getApellido() : "");
		this.imagen = u.getImagen();
		this.recetas = u.getRecetas().stream().map(r->r.getNombre()).collect(Collectors.toList());
	}

}