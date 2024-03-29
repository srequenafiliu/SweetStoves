# <img src="images/00_icono.png" width="25" height="25"> SweetStoves
SweetStoves es un blog de recetas en el cual se pueden encontrar diferentes recetas con sus respectivos detalles para que sean fáciles de seguir. Estas recetas han sido publicadas por los usuarios registrados en SweetStoves. Los usuarios de esta web, aparte de poder crear recetas, también pueden marcar recetas de otros usuarios para guardarlas en su lista, gestionar su cuenta y sus recetas.<br>
En este repositorio encontrarás el código tanto de Back como de Front.
## Backend
La API generada, con enlace *http://localhost:8080/api*, muestra los siguientes recursos:
### **/recetas**
En este enlace se podrá consultar el número de recetas guardadas en la base de datos que coincidan con los filtros especificados (si no se especifica ninguno, este número será el total) y una lista de recetas paginada. En cada página aparecerán máximo 4 recetas si no se establece otro tamaño, y se puede navegar entre páginas con los enlaces en _previous_ y *next*. Las recetas aparecen ordenadas por su ID de forma ascendente, pero se puede cambiar la manera de ordenarlas mediante parámetros. Los atributos que aparecen en las recetas son los siguientes:
- **id**: Dato numérico que identifica la receta
- **usuario**: Dato de tipo string con el nombre del usuario creador de la receta
- **nombre**: Dato de tipo string con el nombre de la receta
- **tipo**: Dato de tipo string. Solo puede ser _dulce_ o _salado_
- **necesidades**: Array de string. Las opciones pueden ser *Sin gluten*, *Sin lactosa* y/o *Vegana*
- **dificultad**: Dato numérico entre el 1 y el 5 que representa la dificultad de la receta
- **imagen**: URL donde se ha guardado la foto de la receta 
- **creacion**: Fecha con formato _yyyy-mm-dd_ de cuando se creó la receta
#### ***Parámetros***
Como se ha mencionado anteriormente, se pueden especificar el número de recetas visualizadas, el orden de las recetas y los filtros para buscar recetas con características contretas. Los parámetros que se pueden usar son los siguientes:
- __size__: Número de recetas visualizadas. Por defecto es 4
- __sortField__: Atributo que se utiliza para ordenar las recetas. Por defecto se utiliza el id
- __sortDir__: Orden de clasificación de la lista. Por defecto es ascendente. Para ordenar descendentemente, se puede utilizar cualquier valor en este parámetro
- __nombre__: Filtro por el nombre de la receta
- __tipo__: Filtro por el tipo de receta (dulce o salado)
- __necesidades__: Filtro por las necesidades especiales de la receta. En este filtro se pueden usar las siguientes letras (se pueden combinar, pero deben estar en el mismo orden que el siguiente para que el filtro funcione adecuadamente):
    - __g__: Hace referencia a la necesidad _Sin gluten_
    - __l__: Hace referencia a la necesidad _Sin lactosa_
    - __v__: Hace referencia a la necesidad _Vegana_
- __dificultad__: Filtro por la dificultad de la receta
- __id_usuario__: Filtro por el usuario creador de la(s) receta(s)
### __/recetas/{id}__
En este enlace se podrá consultar una receta específica. Algunos atributos cambian con respecto a los encontrados en la lista anterior. Asimismo, se añaden otros:
- **usuario**: Este atributo pasa a mostrar un dato de clase Usuario con el id y nombre del mismo
- **needs**: El atributo _necesidades_ pasa a ser un dato de tipo string que tiene el mismo comportamiento que el filtro de necesidades.
- **ingredientes**: Array de strings con todos los ingredientes necesarios para elaborar la receta
- **elaboracion**: Array de string con los pasos a seguir para realizar la receta
- **usuarios**: Lista de datos de clase Usuario que guardaron la receta en su lista personal.
### __/usuarios__
En este enlace se podrá consultar el número de usuarios registrados en la base de datos y una lista de usuarios paginada. Estas páginas funcionan de la misma manera que las de recetas en cuanto a tamaño y navegación. Los atributos que aparecen en las recetas son los siguientes:
- __id__: Dato numérico que identifica al usuario
- __usuario__: Dato de tipo string con el nombre de usuario
- __nombre__: Dato de tipo string con el nombre y apellido(s) del usuario
- __imagen__: URL donde se ha guardado la foto de perfil del usuario. Este dato puede ser nulo
- __recetas__: Lista de los nombres de las recetas creadas por el usuario
#### ***Parámetros***
En este caso, solo se puede especificar el número de usuarios visualizados con el parámetro _size_, cuyo valor por defecto es 6.
### __/usuarios/logged__
En este enlace se podrá consultar el usuario que ha iniciado sesión. De esta manera, sus datos personales son inaccesibles para el resto de personas. Algunos atributos cambian con respecto a los encontrados en la lista anterior. Asimismo, se añaden otros:
- __correo__: Dato de tipo string con el correo del usuario
- __password__: Dato de tipo string con la contraseña del usuario
- __datosUsuario__: Dato de clase DatosUsuario que contiene el nombre, apellido(s) y teléfono del usuario. Todos estos datos son de tipo string y el apellido y el teléfono pueden ser nulos. Este atributo reemplaza al atributo _nombre_
- __recetas__: Lista de recetas creadas por el usuario
- __recetas_seguidas__: Lista de recetas que ha seguido el usuario
## Frontend
Para hacer funcionar SweetStoves debes instalar los siguientes paquetes:
<pre>
npm install
npm i bootstrap
npm i bootswatch@5.3.0
npm i @ng-bootstrap/ng-bootstrap
npm i @fortawesome/fontawesome-free
npm i jwt-decode
</pre>
Podrás acceder a SweetStoves desde el enlace _http://localhost:4200/_, el cual te redireccionará al menú de inicio.
Sabrás que estás en SweetStoves ya que la web tiene un icono propio en la pestaña del navegador.
### Menú de inicio
En el menú de inicio se pueden consultar los servicios que ofrece esta web. Además, se ha implementado una barra de navegación que aparecerá en todos los enlaces. Por ella se puede navegar a las diferentes rutas de SweetStoves.

<img src="images/01_inicio.png">

### Lista de recetas
Aquí aparecerán todas las recetas creadas por los usuarios de SweetStoves. Las tarjetas de las recetas se han diseñado de tal manera que se reconozcan visualmente las recetas dulces (en naranja) de las recetas saladas (en azul).

<img src="images/02_recetas.png">

Esta lista se puede ordenar por dificultad y por fecha de publicación, tanto ascendente como descendentemente. En el siguiente ejemplo se han ordenado por dificultad de manera descendente.

<img src="images/03_recetas_ordenadas.png">

Además, se puede filtrar de diferentes maneras para que el usuario de la web pueda encontrar la receta que más se ajuste a él en el menor tiempo posible. El menú de filtros es desplegable en versión tablet y móvil. También se pueden buscar recetas por nombre mediante la barra de búsqueda en la barra de navegación de SweetStoves. En el siguiente ejemplo se han utilizado los filtros _Dulce_ y *dificultad 2 de 5*.

<img src="images/04_recetas_filtradas.png">

Si el usuario utiliza filtros que no se corresponden con ninguna receta, saltará un mensaje de alerta animándolo a registrarse o a iniciar sesión.

<img src="images/05_recetas_mensaje.png">

Por último, para hacer la experiencia de SweetStoves más agradable, se han añadido la paginación y la opción de cambiar las recetas mostradas por página.

<img src="images/06_recetas_visualizacion.png">

### Detalles de la receta
Si se pincha en el título de una de las recetas, se pueden observar los detalles de la misma. En este apartado se conserva la distinción del tipo de recetas por el color. Además, si la receta no se adapta a ninguna necesidad especial, aparece el link para ir al apartado de _Necesidades especiales_.

<img src="images/07_detalles_salado.png">
<img src="images/08_detalles_dulce.png">

Aparte de los datos visibles en la lista de recetas, también se pueden consultar la lista de ingredientes y el menú de la elaboración de la receta. Dicho menú se puede ir desplegando para ir navegando por cada paso.\
El paso final contiene un botón para volver a la lista de recetas y un botón para añadir la receta a la lista personal del usuario en el caso de haber iniciado sesión y no ser el creador de la receta.

<p align="center"><img src="images/09_paso_final.png" width="525"></p>

### Lista de usuarios
Aquí se pueden ver todos los usuarios registrados en el blog con parte de sus datos. Los usuarios que no tengan foto de perfil tendrán un icono predeterminado (este es el caso del usuario *darks13*). En este apartado también se han añadido la paginación y la opción de cambiar los usuarios mostrados por página. Además, en esta lista se pueden consultar las recetas que ha creado cada usuario pulsando el botón que se encuentra debajo del nombre del usuario.

<img src="images/10_usuarios.png">

### Necesidades especiales
Como algunas recetas no coindicen con ninguna necesidad especial, se han guardado algunos consejos para adaptarlas fácilmente a cualquiera de las necesidades que el usuario tenga. El link para acceder a este apartado se encuentra en la barra de navegación y en las recetas que no especifican ninguna necesidad especial. Para facilitar la navegación en esta página, se ha incluido una tabla de contenido que redirecciona a cada uno de los subapartados.

<img src="images/11_necesidades.png">

### Registro
Se puede acceder a este menú desde la barra de navegación y desde el enlace que se encuentra debajo de la lista de usuarios. También hay un enlace a este menú en el menú de login.

<img src="images/12_registro.png">

La persona que quiera registrarse en SweetStoves debe rellenar al menos los campos obligatorios. Si los rellena mal, saltarán los errores que haya cometido cuando intente registrarse. Asimismo, no se permitirá el registro de un usuario y/o correo electrónico duplicado. El futuro usuario de la web puede retocar los datos erróneos o borrar los datos del formulario con el botón _Borrar datos_.

<p align="center">
    <img src="images/13_registro_errores.png" width="670">
</p>

Cuando se envía el formulario correctamente, se redirecciona al usuario al perfil del nuevo usuario.\
Si el usuario ya tiene cuenta en SweetStoves, puede acceder al menú de login con el link llamado _Prefiero iniciar sesión_, el cual se encuentra debajo de los botones anteriormente mencionados.

### Login
Aparte del enlace que se encontraba en el menú anterior, también se puede acceder al menú de login desde la barra de navegación.

<img src="images/14_login.png">

Si el usuario pulsa el botón _Iniciar sesión_ y al menos uno de los datos no es correcto, aparecerá una alerta.

<img src="images/15_login_alerta.png">

 Solo cuando los datos sean válidos, la web le mandará a su menú de usuario. Si el usuario no está registrado, debajo de este botón está el link que redirecciona al menú de registro.

### Menú de usuario
Cuando el usuario ha iniciado sesión, en la barra de navegación desaparecen los enlaces a los menús de login y registro. En su lugar, aparecerá la foto de perfil del usuario (como es el caso de _trafasan_) o la primera letra de su usuario en caso de no haber guardado foto (como es el caso de *darks13*).

<p align="center">
    <img src="images/16_link_usuario.png" width="415">
</p>

En este menú, el usuario puede hacer varias tareas que puede elegir en el menú lateral que aparece cuando se pulsa el botón _¿Quieres hacer algo hoy?_

<img src="images/17_usuario_opciones.png">

Cuando se mantiene el cursor en uno de los botones, aparece una ventana con una pequeña explicación de la opción y, si se pulsa, debajo de los botones _¿Quieres hacer algo hoy?_ y _Cerrar sesión_ aparece el componente seleccionado:

#### Lista de recetas
Componente seleccionado por defecto. Esta lista de recetas se diferencia a la lista general en dos detalles:
    1. Solo aparecen las recetas que ha guardado el usuario en cuestión.
    2. Aparece el botón “Borrar receta” en las recetas que ha creado el usuario. Si se borra la receta, desaparecerá del blog.

<img src="images/18_usuario_recetas.png">

#### Nueva receta
Este formulario solo está disponible para los usuarios de SweetStoves, ya que la receta debe estar vinculada a un usuario. Al igual que los otros formularios, el botón para enviar los datos estará disponible cuando todos los campos obligatorios se rellenen correctamente.

<img src="images/19_usuario_receta_nueva.png">

#### Actualiza tus recetas
En este apartado aparece un desplegable con todas las recetas creadas del usuario. Este desplegable se encontrará deshabilitado si el usuario no ha
creado ninguna receta.

<img src="images/20_usuario_receta_update.png">

Al seleccionar una receta, aparecerá un formulario casi idéntico que el formulario para añadir una _nueva receta_. La única diferencia son las opciones para la foto de la receta, la cual se puede conservar o cambiar (cuando se selecciona esta opción, aparece el campo para subir la imagen)

<p align="center">
    <img src="images/21_foto_receta.png" width="850">
</p>

#### Actualiza tu cuenta
En este formulario aparecen ya los campos rellenados con los datos actuales del usuario excepto el de la contraseña. Funciona de la misma manera que el formulario de registro en cuanto a errores se refiere. Además, se debe insertar la contraseña actual para poder actualizar los datos correctamente. Nada más enviarlo, los cambios se verán reflejados en el menú de usuario y aparecerá una alerta confirmando que la acción se ha realizado.

<img src="images/22_usuario_update.png">

#### Cambia tu contraseña
Este formulario es específico para actualizar la contraseña. Solo se actualizará cuando la contraseña actual sea la correcta, la nueva contraseña se ajuste al formato y las contraseñas coincidan. Cuando se cumplimente adecuadamente, aparecerá una alerta confirmando que la actualización se ha realizado.

<img src="images/23_usuario_pass.png">

#### Borra tu cuenta
En esta última opción el usuario puede borrar su cuenta, aunque también borrará las recetas que ha creado en SweetStoves.

<img src="images/24_usuario_borrar.png">

### Otros dispositivos
La experiencia de SweetStoves también se puede vivir en Tablet y en móvil. En este apartado se pueden ver algunos menús en formato Tablet (768x886) y móvil (425x886):
- Menú de inicio:
    <p align="center">
    <img src="images/25_inicio_movil.png" width="215">
    <img src="images/26_inicio_tablet.png" width="390">
    </p>
- Lista de recetas:
    <p align="center">
    <img src="images/27_recetas_tablet.png" width="390">
    <img src="images/28_recetas_movil.png" width="215">
    </p>
- Lista de usuarios:
    <p align="center">
    <img src="images/29_usuarios_movil.png" width="215">
    <img src="images/30_usuarios_tablet.png" width="390">
    </p>
- Registro:
    <p align="center">
    <img src="images/31_registro_tablet.png" width="390">
    <img src="images/32_registro_movil.png" width="215">
    </p>
