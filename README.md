# EWatcher
Paneles de Autoconsumo FV y Consumo Eléctrico

### Instalación y Configuración
* **NOTA**: es necesario haber instalado *emoncms* previamente
* Situarse en la carpeta de los módulos de *emoncms* (`/var/www/html/emoncms/Modules/`)
* Clonar el repositorio mediante `git clone https://USUARIO@bitbucket.org/ismsolar/ewatcher.git`, sustituyendo `USUARIO` por tu nombre de usuario
* Visitar `http://IP/emoncms/admin/db` y actualizar la base de datos en caso de ser necesario

### Utilización
Crear usuarios y asignarles paneles mediante el [sistema de gestión de usuarios](https://bitbucket.org/ismsolar/gestion-usuarios/). Una vez un usuario tenga al menos un panel asignado, al entrar en la plataforma *emoncms* verá un menú de *EWatcher* con todos los paneles disponibles.

### Actualización
* Situarse en la carpeta `/var/www/html/emoncms/Modules/ewatcher/` y ejecutar `git pull`
* Descartar los cambios locales en caso de haber discrepancias
* Visitar `http://IP/emoncms/admin/db` y actualizar la base de datos en caso de ser necesario

### Multiidioma
Este proyecto tiene soporte para multiidioma mediante *gettext*. Para traducir a más idiomas (o actualizar los ya existentes):

* Crear una carpeta en `./locale/`, con nombre el código de la región ([ver lista aquí](https://gist.github.com/jacobbubu/1836273)), y dentro una carpeta llamada `LC_MESSAGES`
* Copiar el archivo `messages.po` de una traducción ya existente (por ejemplo `./locale/es_ES/LC_MESSAGES/messages.po`) a la nueva carpeta `LC_MESSAGES`
* Editar el archivo con [POEdit](http://poedit.net)), escogiendo el nuevo idioma para el catálogo
* Traducir las cadenas de texto y guardar el catálogo

### Librerías externas
Se utilizan las siguientes librerías de terceros:

* [TODO]

### Tareas pendientes
* Nuevo README.md (inglés)
  * Qué es
  * Enlace a ewatcher-users
  * Enlace a documentación extensiva
  * Dependencias librerías externas
  * Capturas de pantalla
  * Contributors
  * LICENSE.md
* Documentación más detallada en doc/
    * Documentación cada uno de los javascripts
      * Minimum working examples
    * Inputs/Feeds/Procesos necesarios
    * Documentación completa de cada panel
    * Instalación/Configuración/Actualización
    * Multiidioma
* Liberar proyecto en GitHub
