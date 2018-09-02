using EIAwithAngular.DAL;
using EIAwithAngular.Filters;
using EIAwithAngular.Models;
using EIAwithAngular.Repository;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public List<Object> Get(string TerminalCode, int FinancialYear,string Form1Number, string IGMNumber, string FlightNumber, DateTime? FlightDate , int? CourierCompanyId, string MAWBNumber)
        {
            try
            {
                IQueryable<Object> query = (from form1 in unitOfWork.IMP_Form1_Repository.context.IMP_Form1
                                           join form1details in unitOfWork.IMP_Form1Dtl_Repository.context.IMP_Form1Dtl
                                           on new { ID = (long?)form1.Form1Id }
                                           equals new { ID = form1details.Form1Id }
                                           where (form1.Status == "A") && (form1.TerminalCode == TerminalCode) && (form1.FinYear == "2015")
                                           && (Form1Number == null || form1.Form1No == Form1Number)
                                           && (IGMNumber == null || form1.IgmNo == IGMNumber)
                                           && (FlightNumber == null || form1.FlightNumber == FlightNumber)
                                           && (FlightDate == null || form1.DateOfArrival == FlightDate)
                                           && (CourierCompanyId == 0 || form1details.CourierCoId == CourierCompanyId)
                                           && (MAWBNumber == null || form1details.MAWBNo == MAWBNumber)
                                           select new 
                                           {
                                               form1.Form1Id,form1.Form1No,
                                               IGMNumber = form1.IgmNo,
                                               form1.FlightNumber,
                                               FlightDate = form1.DateOfArrival.Value.ToString() ?? String.Empty,
                                               MAWBNumber = form1details.MAWBNo,
                                               form1.LastUpDtOn                                               
                                           }).GroupBy(o=>o.Form1Id).Select(y=>y.OrderBy(z=>z.Form1No).FirstOrDefault());


                return query.ToList();
                            
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
