import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  servicios:{icon:string, titulo:string, texto:string}[] = [
    {icon:'mitten', titulo:'Gran variedad de recetas', texto:'En esta web encontrarás recetas para todos los gustos y niveles. Tanto si quieres seguir una receta sencilla o enfrentarte a un reto, ¡no podrás elegir solo una!'},
    {icon:'info', titulo:'Recetas para todos...', texto:'Nos gusta compartir nuestra afición por la cocina, por lo que contamos con recetas para intolerantes tanto a la lactosa como al gluten, además de recetas veganas.'},
    {icon:'mobile-screen-button', titulo:'... y en cualquier lugar', texto:'Ofrecemos la misma experiencia en cualquier dispositivo, para que puedas mirar y seguir cualquiera de nuestras recetas en todos los sitios que quieras.'},
    {icon:'users', titulo:'Amplia lista de usuarios', texto:'En nuestro blog fomentamos una comunidad sana y abierta. Si te gusta nuestra web, únete, es totalmente gratis y tendrás acceso a los siguientes servicios.'},
    {icon:'upload', titulo:'Nuevas recetas cada día', texto:'¿Tienes alguna receta que te gustaría compartir o has visto alguna que piensas que debería estar en este blog? Rellena nuestro formulario y enséñasela a todos.'},
    {icon:'list', titulo:'Tu recetario digital', texto:'Podrás acceder rápidamente a tu lista personal de recetas, donde encontrarás las recetas que has creado y las que te hayan gustado de otros usuarios.'}
  ];
}
