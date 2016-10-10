<?php

namespace AppBundle\Controller\Dashboard;

use AppBundle\Entity\Programs;
use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\SecurityBundle\Tests\Functional\Bundle\AclBundle\Entity\Car;
use Symfony\Component\HttpFoundation\Request;

class ProgramsController extends Controller
{
    /**
     * @param Request $request
     * @param integer $worksheet_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheet_id}", name="worksheet-programs")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $worksheet_id)
    {
        $programs = $this->getDoctrine()
            ->getRepository('AppBundle:Programs')
            ->findByWorksheetId($worksheet_id);
        $worksheet = $this->getDoctrine()
            ->getRepository('AppBundle:Worksheets')
            ->find($worksheet_id);

        return $this->render('dashboard/worksheets/programs.html.twig', [
            'programs'  => $programs,
            'worksheet' => $worksheet
        ]);
    }
    /**
     * @param Request $request
     * @param integer $worksheet_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheet_id}/add", name="worksheet-programs-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request, $worksheet_id)
    {
        $data = $request->request->all();

        $program = new Programs();
        $program->setWorksheetId($worksheet_id);
        $program->setName($data['program_name']);
        $program->setDayPart($data['day_part']);
        $program->setStation($data['station']);
        $program->setNetwork($data['network']);
        $program->setProgram($data['program']);

        $program->setMonday(false);
        if(isset($data['monday']))
        {
            $program->setMonday(true);
        }

        $program->setTuesday(false);
        if(isset($data['tuesday']))
        {
            $program->setTuesday(true);
        }

        $program->setWednesday(false);
        if(isset($data['wednesday']))
        {
            $program->setWednesday(true);
        }

        $program->setThursday(false);
        if(isset($data['thursday']))
        {
            $program->setThursday(true);
        }

        $program->setFriday(false);
        if(isset($data['friday']))
        {
            $program->setFriday(true);
        }

        $program->setSaturday(false);
        if(isset($data['saturday']))
        {
            $program->setSaturday(true);
        }

        $program->setSunday(false);
        if(isset($data['sunday']))
        {
            $program->setSunday(true);
        }

        $program->setTimeSlotStart(Carbon::parse($data['start_time']));
        $program->setTimeSlotEnd(Carbon::parse($data['end_time']));
        $program->setSpotLength((int)$data['spot_length']);
        $program->setSpotRate((int)$data['spot_rate']);
        $program->setBreakCode($data['break_code']);
        $program->setComment($data['comments']);
        $program->setCreatedAt(Carbon::now());
        $program->setUpdatedAt(Carbon::now());

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($program);
        $orm->flush();

        return $this->redirect("/campaigns/worksheets/programs/$worksheet_id");
    }
}