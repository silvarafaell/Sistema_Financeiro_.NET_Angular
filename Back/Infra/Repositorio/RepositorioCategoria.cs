
using Domain.Interfaces.ICategoria;
using Entities.Entidades;
using Infra.Repositorio.Generics;

namespace Infra.Repositorio
{
    public class RepositorioCategoria : RepositoryGenerics<Categoria>, InterfaceCategoria
    {
        public Task<IList<Categoria>> ListarCategoriaUsuario(string emailUsuario)
        {
            throw new NotImplementedException();
        }
    }
}
