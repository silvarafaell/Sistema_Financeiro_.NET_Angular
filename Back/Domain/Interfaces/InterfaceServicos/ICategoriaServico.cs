
using Entities.Entidades;

namespace Domain.Interfaces.InterfaceServicos
{
    public interface ICategoriaServico
    {
        Task AdicionarCategoria(Categoria categoria);
        Task AtualizarCategoria(Categoria categoria);
    }
}
