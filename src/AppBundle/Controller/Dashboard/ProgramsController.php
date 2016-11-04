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
     * @param integer $worksheetId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheetId}", name="worksheet-programs")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $worksheetId)
    {
        $programs = $this->getDoctrine()
            ->getRepository('AppBundle:Programs')
            ->findByWorksheetId($worksheetId);
        $worksheet = $this->getDoctrine()
            ->getRepository('AppBundle:Worksheets')
            ->find($worksheetId);

        return $this->render('dashboard/worksheets/programs/index.html.twig', [
            'programs' => $programs,
            'worksheet' => $worksheet
        ]);
    }

    /**
     * @param Request $request
     * @param integer $worksheetId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheetId}/add", name="worksheet-programs-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request, $worksheetId)
    {
        $data = $request->request->all();

        $program = new Programs();
        $program->setWorksheetId($worksheetId);
        $program->setName($data['program_name']);
        $program->setDayPart($data['day_part']);
        $program->setStation($data['station']);
        $program->setNetwork($data['network']);
        $program->setProgram($data['program']);

        $program->setMonday(false);
        if (isset($data['monday'])) {
            $program->setMonday(true);
        }

        $program->setTuesday(false);
        if (isset($data['tuesday'])) {
            $program->setTuesday(true);
        }

        $program->setWednesday(false);
        if (isset($data['wednesday'])) {
            $program->setWednesday(true);
        }

        $program->setThursday(false);
        if (isset($data['thursday'])) {
            $program->setThursday(true);
        }

        $program->setFriday(false);
        if (isset($data['friday'])) {
            $program->setFriday(true);
        }

        $program->setSaturday(false);
        if (isset($data['saturday'])) {
            $program->setSaturday(true);
        }

        $program->setSunday(false);
        if (isset($data['sunday'])) {
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

        $orm = $this->get('doctrine')->getManager();
        $orm->persist($program);
        $orm->flush();

        return $this->redirect("/campaigns/worksheets/programs/$worksheetId");
    }

    /**
     * @param Request $request
     * @param integer $worksheetId
     * @param integer $programId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheetId}/delete/{programId}", name="program-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $worksheetId, $programId)
    {
        $program = $this->getDoctrine()
            ->getRepository('AppBundle:Programs')
            ->find($programId);

        $orm = $this->get('doctrine')->getManager();
        $orm->remove($program);
        $orm->flush();

        return $this->redirect('/campaigns/worksheets/programs/' . $worksheetId, 302);
    }

    /**
     * @param Request $request
     * @param integer $worksheetId
     * @param integer $programId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheetId}/edit/{programId}", name="program-edit")
     * @Method({"GET"})
     */
    public function editAction(Request $request, $worksheetId, $programId)
    {
        $program = $this->getDoctrine()
            ->getRepository('AppBundle:Programs')
            ->find($programId);
        $worksheet = $this->getDoctrine()
            ->getRepository('AppBundle:Worksheets')
            ->find($worksheetId);

        return $this->render('dashboard/worksheets/programs/edit.html.twig', [
            'program' => $program,
            'worksheet' => $worksheet
        ]);
    }

    /**
     * @param Request $request
     * @param integer $worksheetId
     * @param integer $programId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/programs/{worksheetId}/update/{programId}", name="program-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $worksheetId, $programId)
    {
        $data = $request->request->all();
        $orm = $this->getDoctrine()->getManager();
        $program = $orm->getRepository('AppBundle:Programs')->find($programId);

        $program->setWorksheetId($worksheetId);
        $program->setName($data['program_name']);
        $program->setDayPart($data['day_part']);
        $program->setStation($data['station']);
        $program->setNetwork($data['network']);
        $program->setProgram($data['program']);

        $program->setMonday(false);
        if (isset($data['monday'])) {
            $program->setMonday(true);
        }

        $program->setTuesday(false);
        if (isset($data['tuesday'])) {
            $program->setTuesday(true);
        }

        $program->setWednesday(false);
        if (isset($data['wednesday'])) {
            $program->setWednesday(true);
        }

        $program->setThursday(false);
        if (isset($data['thursday'])) {
            $program->setThursday(true);
        }

        $program->setFriday(false);
        if (isset($data['friday'])) {
            $program->setFriday(true);
        }

        $program->setSaturday(false);
        if (isset($data['saturday'])) {
            $program->setSaturday(true);
        }

        $program->setSunday(false);
        if (isset($data['sunday'])) {
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

        $orm->flush();

        return $this->redirect('/campaigns/worksheets/programs/' . $worksheetId . '/edit/' . $programId);
    }
}