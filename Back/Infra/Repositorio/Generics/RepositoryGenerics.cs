
using Domain.Interfaces.Generics;
using Infra.Configuracao;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32.SafeHandles;
using System.Runtime.InteropServices;

namespace Infra.Repositorio.Generics
{
    public class RepositoryGenerics<T> : InterfaceGeneric<T>, IDisposable where T : class
    {
        private readonly DbContextOptions<ContextBase> _OptionsBuilder;

        public RepositoryGenerics()
        {
            _OptionsBuilder = new DbContextOptions<ContextBase>();
        }

        public async Task Add(T Objeto)
        {
            using (var banco = new ContextBase(_OptionsBuilder))
            {
                await banco.Set<T>().AddAsync(Objeto);
                await banco.SaveChangesAsync();
            }
        }

        public async Task Delete(T Objeto)
        {
            using (var banco = new ContextBase(_OptionsBuilder))
            {
                banco.Set<T>().Remove(Objeto);
                await banco.SaveChangesAsync();
            }
        }

        public async Task<T> GetEntityById(int Id)
        {
            using (var banco = new ContextBase(_OptionsBuilder))
            {
                return await banco.Set<T>().FindAsync(Id);
            }
        }

        public async Task<List<T>> List()
        {
            using (var banco = new ContextBase(_OptionsBuilder))
            {
                return banco.Set<T>().AsNoTracking().ToList();

            }
        }

        public async Task Update(T Objeto)
        {
            using (var banco = new ContextBase(_OptionsBuilder))
            {
                banco.Set<T>().Update(Objeto);
                await banco.SaveChangesAsync();
            }
        }

        #region Disposed https://docs.microsoft.com/pt-br/dotnet/standard/garbage-collection/implementing-dispose
        // Flag: Has Dispose already been called?
        bool disposed = false;
        // Instantiate a SafeHandle instance.
        SafeHandle handle = new SafeFileHandle(IntPtr.Zero, true);



        // Public implementation of Dispose pattern callable by consumers.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }


        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                handle.Dispose();
                // Free any other managed objects here.
                //
            }

            disposed = true;
        }
        #endregion
    }
}
