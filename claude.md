Proyecto sencillo con vite y react. Está por decididir la BBDD que debería de ir detrás.

El objetivo del proyecto será tener una vista de una matriz, donde tendré una columna por cada empleado y podré ver el valor que tiene por cada fecha a la izquierda.

El objetivo es poder cambiar los valores de cada uno de estos de una manera muy muy sencilla, poder seleccionar mas de una columna para poder pegar un valor, etc... es decir una funcionalidad parecida a la del excel a la hora editar los registros.

Es importante que tengamos en cuenta el uso de la virtualización y la carga de datos para que la usabilidad de la aplicación tenga un performance excelente y sea muy rápida tanto la visualización de datos como la modificación.
Pensemos que tendremos millones de registros, ya que pueden haber más 300 empleados y podremos tendremos un registro por cada uno de ellos de momento por cada día. Los datos se deben de actualizar en realtime y permitir la coedicion de multiples usuarios.

A nivel visual usaremos una biblioteca de compontentes  shadcn y un único fuente de iconos que está por decidir.


La BBDD. podría ser postgreSQL con prisma o un noSQL como Firabse o COSMOSDB. Me interesa que vaya muy muy rápido. 

De momento la BBDD debería tener.

FASE 1 (MVP):
TenantId (tenantid, name)
Teams (FullName, DisplayName, Manager(empleado), color, TenantId)
Empleados (FullName, DisplayName, Team, Permisos (editar, ver), TenantId)
Registros (Empleado, Fecha, Valor, Estilo, TenantId)
Vistas (Propietario(Empleado), Filtros, Shared ([Empleados]), color, TenantId )

Se puede ver un ejemplo del actual excel que usamos para esto en ./image.png