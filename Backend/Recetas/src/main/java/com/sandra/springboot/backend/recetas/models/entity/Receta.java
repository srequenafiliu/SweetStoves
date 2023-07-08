package com.sandra.springboot.backend.recetas.models.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "receta")
public class Receta implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	@NonNull
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Le da números consecutivos, un auto-numérico
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;
	
	@NonNull
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "usuario", nullable = false)
	@JsonIgnoreProperties({"correo","password","imagen","datosUsuario","recetas","recetas_seguidas"})
	private Usuario usuario;
	
	@NonNull
	@Column(name = "nombre", nullable = false)
	@NotBlank
	@Size(min = 4, message = "debe contener mínimo 4 caracteres")
	private String nombre;
	
	@NonNull
	@NotBlank
	@Column(name = "tipo", nullable = false)
	private String tipo;
	
	private transient List<String> necesidades;
	
	@Column(name = "needs", nullable = false)
	@JsonIgnore
	private String needs;
	
	@NonNull
	@NotNull
	@NotEmpty
	@Size(min = 2, message = "debe contener al menos 2 ingredientes")
	@Column(name = "ingredientes", nullable = false, length = 1000)
	private List<String> ingredientes;
	
	@NonNull
	@NotNull
	@NotEmpty
	@Size(min = 2, message = "debe constar de al menos 2 pasos")
	@Column(name = "elaboracion", nullable = false, length = 1000)
	private List<String> elaboracion;
	
	@NonNull
	@Min(value = 1, message = "debe estar entre 1 y 5")
	@Max(value = 5, message = "debe estar entre 1 y 5")
	@Column(name = "dificultad", nullable = false)
	private Integer dificultad;
	
	@Column(name = "imagen", nullable = false)
	private String imagen;
	
	@NonNull
	@Temporal(TemporalType.DATE)
	@Column(name = "creacion", nullable = false, length = 13)
	private Date creacion;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "recetas_seguidas_usuario", joinColumns = {
			@JoinColumn(name = "receta", nullable = false, updatable = false) }, inverseJoinColumns = {
					@JoinColumn(name = "usuario", nullable = false, updatable = false) })
	@JsonIgnoreProperties({"correo","password","imagen","datosUsuario","recetas","recetas_seguidas"})
	private Set<Usuario> usuarios = new HashSet<Usuario>(0);

	public Receta(Receta r) {
		this.id = r.id;
		this.usuario = r.usuario;
		this.nombre = r.nombre;
		this.tipo = r.tipo;
		this.necesidades = r.necesidades;
		this.needs = r.needs;
		this.ingredientes = r.ingredientes;
		this.elaboracion = r.elaboracion;
		this.dificultad = r.dificultad;
		this.imagen = r.imagen;
		this.creacion = r.creacion;
		this.usuarios = r.usuarios;
	}

	public Receta(Integer id, Usuario usuario, String nombre, String tipo, String needs, List<String> ingredientes,
			List<String> elaboracion, Integer dificultad, String imagen, Date creacion, Set<Usuario> usuarios) {
		this.id = id;
		this.usuario = usuario;
		this.nombre = nombre;
		this.tipo = tipo;
		this.necesidades = getNecesidades();
		this.needs = needs;
		this.ingredientes = ingredientes;
		this.elaboracion = elaboracion;
		this.dificultad = dificultad;
		this.imagen = imagen;
		this.creacion = creacion;
		this.usuarios = usuarios;
	}
	
	public List<String> getNecesidades() {
		necesidades = new ArrayList<>();
		if (needs.contains("g")) necesidades.add("Sin gluten");
		if (needs.contains("l")) necesidades.add("Sin lactosa");
		if (needs.contains("v")) necesidades.add("Vegana");
		return necesidades;
	}
	
	public void setNeeds(String needs) {
		if (necesidades.contains("Sin gluten")) needs += "g";
		if (necesidades.contains("Sin lactosa")) needs += "l";
		if (necesidades.contains("Vegana")) needs += "v";
		this.needs = needs;
	}

}
