using EIAwithAngular.Filters;
using EIAwithAngular.Models;
using EIAwithAngular.Repository;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace EIAwithAngular.Controllers
{
    [AntiForgeryValidate]
    public class MastersDetailController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        //[Route("api/MastersDetail/Get")]
        [HttpGet]
        public IEnumerable<M_CommonMaster_MST> Get()
        {
            try
            {
                return unitOfWork.M_CommonMaster_MST_Repository.Get();
            }
            catch (Exception)
            {

                throw;
            }

        }

        [Route("api/MastersDetail/AirportSearch")]
        [HttpGet]
        public IEnumerable<M_Airport_MST> AirportSearch()
        {
            try
            {
                return unitOfWork.M_Airport_MST_Repository.Get();
            }
            catch (Exception)
            {

                throw;
            }

        }

        //[Route("api/MastersDetail/Search")]
        [HttpPost]
        public IEnumerable<VWEDT_COURIERMST> Get(VWEDT_COURIERMST vwedt_couriermst)
        {
            try
            {
                IQueryable<VWEDT_COURIERMST> query = unitOfWork.m_courier_mst_Repository.context.VWEDT_COURIERMST;

                if (vwedt_couriermst.TerminalCode != "")
                    query = query.Where(p => p.TerminalCode == vwedt_couriermst.TerminalCode);

                if (vwedt_couriermst.CourierCoName != "")
                    query = query.Where(p => p.CourierCoName.Contains(vwedt_couriermst.CourierCoName));

                if (vwedt_couriermst.CourierCoCode != "")
                    query = query.Where(p => p.CourierCoCode.Contains(vwedt_couriermst.CourierCoCode));

                if (vwedt_couriermst.CourierType != "")
                    query = query.Where(p => p.CourierType == vwedt_couriermst.CourierType);

                if (vwedt_couriermst.MemberTypeId != "")
                    query = query.Where(p => p.MemberTypeId == vwedt_couriermst.MemberTypeId);

                return query;
            }
            catch (Exception e)
            {
                throw;
            }

        }

        [Route("api/MastersDetail/FlightSearch")]
        [HttpPost]
        public IEnumerable<VWEDT_FLIGHTMASTERMST> Get(VWEDT_FLIGHTMASTERMST vwet_flighmastermst)
        {
            try
            {
                IQueryable<VWEDT_FLIGHTMASTERMST> query = unitOfWork.vwdt_couriermst_Repository.context.VWEDT_FLIGHTMASTERMST;

                if (!string.IsNullOrEmpty(vwet_flighmastermst.TerminalCode))
                    query = query.Where(p => p.TerminalCode == vwet_flighmastermst.TerminalCode);

                if (!string.IsNullOrEmpty(vwet_flighmastermst.FlightNumber))
                    query = query.Where(p => p.FlightNumber.Contains(vwet_flighmastermst.FlightNumber));

                if (!string.IsNullOrEmpty(vwet_flighmastermst.AirlineCode))
                    query = query.Where(p => p.AirlineCode.Contains(vwet_flighmastermst.AirlineCode));

                if (!string.IsNullOrEmpty(vwet_flighmastermst.FlightType))
                    query = query.Where(p => p.FlightType == vwet_flighmastermst.FlightType);

                return query;              
            }
            catch (Exception e)
            {
                throw;
            }

        }

        [Route("api/MastersDetail/Post")]
        [HttpPost]
        public void Post(JObject data)
        {

            dynamic jsonData = data;

            var obj = jsonData.obj;
            string Name = jsonData.MasterName;

            JObject jObj = jsonData.obj as JObject;

            if (obj != null)
            {
                try
                {
                    if (Name == "couriermaster")
                    {
                        M_Courier_MST m_courier_mst = jObj.ToObject<M_Courier_MST>();
                        //M_Courier_MST m_courier_mst = JsonConvert.DeserializeObject<M_Courier_MST>(obj);

                        if (m_courier_mst.CourierCoId == 0)
                        {
                            m_courier_mst.CreatedOn = DateTime.Now;
                            unitOfWork.m_courier_mst_Repository.Insert(m_courier_mst);
                        }
                        else if (m_courier_mst.CourierCoId > 0)
                        {
                            m_courier_mst.LastUpDtOn = DateTime.Now;
                            unitOfWork.m_courier_mst_Repository.Update(m_courier_mst);
                        }
                    }
                    else if (Name == "flightmaster")
                    {
                        M_Flightmaster_MST m_flightmaster_mst = jObj.ToObject<M_Flightmaster_MST>();

                        if (!(unitOfWork.M_Flightmaster_MST_Repository.dbSet.Any(u=>u.FlightNumber == m_flightmaster_mst.FlightNumber)))
                        {
                            m_flightmaster_mst.CreatedOn = DateTime.Now;
                            unitOfWork.M_Flightmaster_MST_Repository.Insert(m_flightmaster_mst);
                        }
                        else 
                        {
                            m_flightmaster_mst.LastUpDtOn = DateTime.Now;
                            unitOfWork.M_Flightmaster_MST_Repository.Update(m_flightmaster_mst);
                        }
 
                    }
                    
                    unitOfWork.Save();
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public Object Get(long id)
        {
            try
            {                
                return unitOfWork.m_courier_mst_Repository.GetByID(id);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        [Route("api/MastersDetail/Remove")]
        [HttpPost]
        public void Remove(JObject data)
        {
            try
            {
                dynamic jsonData = data;

                string loginid = jsonData.loginid;
                JArray jsonids = jsonData.ids;
                string Name = jsonData.MasterName;

                string ids = string.Join(",", jsonids);


                if (Name == "couriermaster")
                {
                    var id = ids.Split(',').Select(x => Int64.Parse(x)).ToArray();

                    unitOfWork.m_courier_mst_Repository.dbSet.Where(x => id.Contains(x.CourierCoId))
                    .ToList()
                    .ForEach(a =>
                        {
                            a.Status = "D";
                            a.MC_Status = "D";
                            a.LastUpDtBy = loginid;
                            a.LastUpDtOn = DateTime.Now;
                        });
                }
                else if (Name == "flightmaster")
                {                    

                    unitOfWork.M_Flightmaster_MST_Repository.dbSet.Where(x => ids.Contains(x.FlightNumber))
                    .ToList()
                    .ForEach(a =>
                    {
                        a.Status = "D";
                        a.MC_Status = "D";
                        a.LastUpDtBy = loginid;
                        a.LastUpDtOn = DateTime.Now;
                    });
                }

                unitOfWork.Save();
            }
            catch (Exception e)
            {
                throw;
            }
        }

    }
}
