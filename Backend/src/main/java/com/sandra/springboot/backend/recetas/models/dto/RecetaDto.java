package com.sandra.springboot.backend.recetas.models.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sandra.springboot.backend.recetas.models.entity.Receta;
import com.sandra.springboot.backend.recetas.models.entity.Usuario;

import lombok.Data;

@Data
public class RecetaDto implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer id;
	@JsonIgnoreProperties({"correo","password","imagen","datosUsuario","recetas","recetas_seguidas"})
	private Usuario usuario;
	private String nombre;
	private String tipo;
	private List<String> necesidades;
	private List<String> ingredientes;
	private List<String> elaboracion;
	private Integer dificultad;
	private String imagen;
	private Date creacion;
	@JsonIgnoreProperties({"correo","password","imagen","datosUsuario","recetas","recetas_seguidas"})
	private Set<Usuario> usuarios = new HashSet<Usuario>(0);

	public RecetaDto(Receta r) {
		this.id = r.getId();
		this.usuario = r.getUsuario();
		this.nombre = r.getNombre();
		this.tipo = r.getTipo();
		this.necesidades = getNecesidades(r.getNeeds());
		this.ingredientes = r.getIngredientes();
		this.elaboracion = r.getElaboracion();
		this.dificultad = r.getDificultad();
		this.imagen = r.getImagen();
		this.creacion = r.getCreacion();
		this.usuarios = r.getUsuarios();
	}
	
	public List<String> getNecesidades(String needs) {
		necesidades = new ArrayList<>();
		if (needs.contains("g")) necesidades.add("Sin gluten");
		if (needs.contains("l")) necesidades.add("Sin lactosa");
		if (needs.contains("v")) necesidades.add("Vegana");
		return necesidades;
	}

}
