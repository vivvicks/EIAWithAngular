using EIAwithAngular.DAL;
using EIAwithAngular.Models;
using EntityFrameworkExtras.EF6;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace EIAwithAngular.Repository
{
    public class UnitOfWork : IDisposable
    {
        private EIA_DEVEntities context = new EIA_DEVEntities();
        private GenericRepository<M_CommonMaster_MST> m_commonMaster_mst;
        private GenericRepository<VWEDT_COURIERMST> vwdt_couriermst;
        private GenericRepository<M_Courier_MST> m_courier_mst;
        private GenericRepository<VWEDT_FLIGHTMASTERMST> vwet_flighmastermst;
        private GenericRepository<M_Flightmaster_MST> m_flightmaster_mst;
        private GenericRepository<M_Airport_MST> m_airport_mst;
        private GenericRepository<GetFlightNumber_Result> getflightnumber;

        public GenericRepository<M_CommonMaster_MST> M_CommonMaster_MST_Repository
        {
            get
            {
                if (this.m_commonMaster_mst == null)
                {
                    this.m_commonMaster_mst = new GenericRepository<M_CommonMaster_MST>(context);
                }
                return m_commonMaster_mst;
            }
        }

        public GenericRepository<VWEDT_COURIERMST> vwdt_couriermst_Repository
        {
            get
            {
                if (this.vwdt_couriermst == null)
                {
                    this.context.Configuration.ProxyCreationEnabled = false;
                    this.vwdt_couriermst = new GenericRepository<VWEDT_COURIERMST>(context);
                }
                return vwdt_couriermst;
            }
        }

        public GenericRepository<M_Courier_MST> m_courier_mst_Repository
        {
            get
            {
                if (this.m_courier_mst == null)
                {
                    this.m_courier_mst = new GenericRepository<M_Courier_MST>(context);
                }
                return m_courier_mst;
            }
        }

        public GenericRepository<VWEDT_FLIGHTMASTERMST> vwet_flighmastermst_Repository
        {
            get
            {
                if (this.vwet_flighmastermst == null)
                {
                    this.vwet_flighmastermst = new GenericRepository<VWEDT_FLIGHTMASTERMST>(context);
                }
                return vwet_flighmastermst;
            }
        }

        public GenericRepository<M_Flightmaster_MST> M_Flightmaster_MST_Repository
        {
            get
            {
                if (this.m_flightmaster_mst == null)
                {
                    this.m_flightmaster_mst = new GenericRepository<M_Flightmaster_MST>(context);
                }
                return m_flightmaster_mst;
            }
        }

        public GenericRepository<M_Airport_MST> M_Airport_MST_Repository
        {
            get
            {
                if (this.m_airport_mst == null)
                {
                    this.m_airport_mst = new GenericRepository<M_Airport_MST>(context);
                }
                return m_airport_mst;
            }
        }

        public IEnumerable<GetFlightNumber_Result> flightList(string TerminalCode,string AirlineCode,string FlightType)
        {
            IEnumerable<GetFlightNumber_Result> result = null;

            using (var context = new EIA_DEVEntities())
            {
                result = context.Database.ExecProcedure<GetFlightNumber_Result>("GetFlightNumber", new
                {
                    TerminalCode = TerminalCode,
                    AirlineCode = DBNull.Value,
                    FlightType = FlightType

                }).ToList();
            }

            return result;
        }


        public GetFlightDetails_Result flightDetail(string FlightNumber, string TerminalCode)
        {
            GetFlightDetails_Result result = null;

            using (var context = new EIA_DEVEntities())
            {
                result = context.Database.ExecProcedure<GetFlightDetails_Result>("GetFlightDetails", new
                {
                    FlightNumber = FlightNumber,
                    TerminalCode = TerminalCode

                }).FirstOrDefault();
            }

            return result;
        }

        public IEnumerable<GetCourierCompanyName_Result> courierlist(string TerminalCode)
        {
            IEnumerable<GetCourierCompanyName_Result> result = null;

            using (var context = new EIA_DEVEntities())
            {
                result = context.Database.ExecProcedure<GetCourierCompanyName_Result>("GetCourierCompanyName", new
                {
                    TerminalCode = TerminalCode

                }).ToList();
            }

            return result;
        }

        public void CreateForm1(AddForm1Details addForm1Details)
        {
            using (var context = new EIA_DEVEntities())
            {
                context.Database.ExecuteStoredProcedure(addForm1Details);
            }
        }

        public GetForm1CheckStatus_Result GetForm1CheckStatus(string IGMNumber, string MAWBNumber, string TerminalCode)
        {
            GetForm1CheckStatus_Result result = null;

            using (var context = new EIA_DEVEntities())
            {
               result = context.Database.ExecProcedure<GetForm1CheckStatus_Result>("GetForm1CheckStatus", new
               {
                   IGMNumber = IGMNumber,
                   MAWBNumber = MAWBNumber,
                   TerminalCode = TerminalCode

               }).FirstOrDefault();
            }

            return result;
        }

        public void Save()
        {
            context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}