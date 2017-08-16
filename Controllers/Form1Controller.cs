using EIAwithAngular.DAL;
using EIAwithAngular.Filters;
using EIAwithAngular.Models;
using EIAwithAngular.Repository;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace EIAwithAngular.Controllers
{
    [AntiForgeryValidate]
    public class Form1Controller : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();

        [HttpGet]
        public IEnumerable<GetFlightNumber_Result> Get(string TerminalCode, string AirlineCode, string FlightType)
        {
            try
            {
                return unitOfWork.flightList(TerminalCode, AirlineCode, FlightType);
            }
            catch (Exception)
            {

                throw;
            }

        }

        [HttpGet]
        public IEnumerable<GetCourierCompanyName_Result> Get(string TerminalCode)
        {
            try
            {
                return unitOfWork.courierlist(TerminalCode);
            }
            catch (Exception)
            {

                throw;
            }

        }

        [HttpGet]
        public GetFlightDetails_Result Get(string FlightNumber, string TerminalCode)
        {
            try
            {
                return unitOfWork.flightDetail(FlightNumber, TerminalCode);
            }
            catch (Exception)
            {

                throw;
            }

        }

        [Route("api/Form1/GetIGMDetails")]
        [HttpGet]
        public GetForm1CheckStatus_Result GetIGMDetails(string IGMNumber, string MAWBNumber, string TerminalCode)
        {
            try
            {
                return unitOfWork.GetForm1CheckStatus(IGMNumber, MAWBNumber, TerminalCode);
            }
            catch (Exception)
            {
                throw;
            }

        }

        [HttpPost]
        public void Post(AddForm1Details data)
        {
            data.LastUpDtOn = DateTime.Now;
            unitOfWork.CreateForm1(data);
        }
    }
}
