package com.sandra.springboot.backend.recetas.models.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.sandra.springboot.backend.recetas.models.entity.Receta;

import lombok.Data;

@Data
public class RecetaDto implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String usuario;
	private String nombre;
	private String tipo;
	private List<String> necesidades;
	private Integer dificultad;
	private String imagen;
	private Date creacion;

	public RecetaDto(Receta r) {
		this.id = r.getId();
		this.usuario = r.getUsuario().getUsuario();
		this.nombre = r.getNombre();
		this.tipo = r.getTipo();
		this.necesidades = getNecesidades(r.getNeeds());
		this.dificultad = r.getDificultad();
		this.imagen = r.getImagen();
		this.creacion = r.getCreacion();
	}
	
	public List<String> getNecesidades(String needs) {
		necesidades = new ArrayList<>();
		if (needs.contains("g")) necesidades.add("Sin gluten");
		if (needs.contains("l")) necesidades.add("Sin lactosa");
		if (needs.contains("v")) necesidades.add("Vegana");
		return necesidades;
	}

}
