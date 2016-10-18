<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Programs
 *
 * @ORM\Table(name="programs")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProgramsRepository")
 */
class Programs
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="worksheet_id", type="integer")
     * @Assert\NotBlank()
     */
    private $worksheetId;

    /**
     * @var string
     *
     * @ORM\Column(name="day_part", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $dayPart;

    /**
     * @var string
     *
     * @ORM\Column(name="station", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $station;

    /**
     * @var string
     *
     * @ORM\Column(name="network", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $network;

    /**
     * @var string
     *
     * @ORM\Column(name="program", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $program;

    /**
     * @var bool
     *
     * @ORM\Column(name="monday", type="boolean")
     * @Assert\NotBlank()
     */
    private $monday;

    /**
     * @var bool
     *
     * @ORM\Column(name="tuesday", type="boolean")
     * @Assert\NotBlank()
     */
    private $tuesday;

    /**
     * @var bool
     *
     * @ORM\Column(name="wednesday", type="boolean")
     * @Assert\NotBlank()
     */
    private $wednesday;

    /**
     * @var bool
     *
     * @ORM\Column(name="thursday", type="boolean")
     * @Assert\NotBlank()
     */
    private $thursday;

    /**
     * @var bool
     *
     * @ORM\Column(name="friday", type="boolean")
     * @Assert\NotBlank()
     */
    private $friday;

    /**
     * @var bool
     *
     * @ORM\Column(name="saturday", type="boolean")
     * @Assert\NotBlank()
     */
    private $saturday;

    /**
     * @var bool
     *
     * @ORM\Column(name="sunday", type="boolean")
     * @Assert\NotBlank()
     */
    private $sunday;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="time_slot_start", type="time")
     * @Assert\NotBlank()
     */
    private $timeSlotStart;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="time_slot_end", type="time")
     * @Assert\NotBlank()
     */
    private $timeSlotEnd;

    /**
     * @var int
     *
     * @ORM\Column(name="spot_length", type="integer")
     * @Assert\NotBlank()
     */
    private $spotLength;

    /**
     * @var float
     *
     * @ORM\Column(name="spot_rate", type="decimal", precision=13, scale=2)
     * @Assert\NotBlank()
     */
    private $spotRate;

    /**
     * @var string
     *
     * @ORM\Column(name="break_code", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $breakCode;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="text")
     * @Assert\NotBlank()
     */
    private $comment;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     * @Assert\NotBlank()
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime")
     * @Assert\NotBlank()
     */
    private $updatedAt;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Programs
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set worksheetId
     *
     * @param integer $worksheetId
     *
     * @return Programs
     */
    public function setWorksheetId($worksheetId)
    {
        $this->worksheetId = $worksheetId;

        return $this;
    }

    /**
     * Get worksheetId
     *
     * @return int
     */
    public function getWorksheetId()
    {
        return $this->worksheetId;
    }

    /**
     * Set dayPart
     *
     * @param string $dayPart
     *
     * @return Programs
     */
    public function setDayPart($dayPart)
    {
        $this->dayPart = $dayPart;

        return $this;
    }

    /**
     * Get dayPart
     *
     * @return string
     */
    public function getDayPart()
    {
        return $this->dayPart;
    }

    /**
     * Set station
     *
     * @param string $station
     *
     * @return Programs
     */
    public function setStation($station)
    {
        $this->station = $station;

        return $this;
    }

    /**
     * Get station
     *
     * @return string
     */
    public function getStation()
    {
        return $this->station;
    }

    /**
     * Set network
     *
     * @param string $network
     *
     * @return Programs
     */
    public function setNetwork($network)
    {
        $this->network = $network;

        return $this;
    }

    /**
     * Get network
     *
     * @return string
     */
    public function getNetwork()
    {
        return $this->network;
    }

    /**
     * Set program
     *
     * @param string $program
     *
     * @return Programs
     */
    public function setProgram($program)
    {
        $this->program = $program;

        return $this;
    }

    /**
     * Get program
     *
     * @return string
     */
    public function getProgram()
    {
        return $this->program;
    }

    /**
     * Set monday
     *
     * @param boolean $monday
     *
     * @return Programs
     */
    public function setMonday($monday)
    {
        $this->monday = $monday;

        return $this;
    }

    /**
     * Get monday
     *
     * @return bool
     */
    public function getMonday()
    {
        return $this->monday;
    }

    /**
     * Set tuesday
     *
     * @param boolean $tuesday
     *
     * @return Programs
     */
    public function setTuesday($tuesday)
    {
        $this->tuesday = $tuesday;

        return $this;
    }

    /**
     * Get tuesday
     *
     * @return bool
     */
    public function getTuesday()
    {
        return $this->tuesday;
    }

    /**
     * Set wednesday
     *
     * @param boolean $wednesday
     *
     * @return Programs
     */
    public function setWednesday($wednesday)
    {
        $this->wednesday = $wednesday;

        return $this;
    }

    /**
     * Get wednesday
     *
     * @return bool
     */
    public function getWednesday()
    {
        return $this->wednesday;
    }

    /**
     * Set thursday
     *
     * @param boolean $thursday
     *
     * @return Programs
     */
    public function setThursday($thursday)
    {
        $this->thursday = $thursday;

        return $this;
    }

    /**
     * Get thursday
     *
     * @return bool
     */
    public function getThursday()
    {
        return $this->thursday;
    }

    /**
     * Set friday
     *
     * @param boolean $friday
     *
     * @return Programs
     */
    public function setFriday($friday)
    {
        $this->friday = $friday;

        return $this;
    }

    /**
     * Get friday
     *
     * @return bool
     */
    public function getFriday()
    {
        return $this->friday;
    }

    /**
     * Set saturday
     *
     * @param boolean $saturday
     *
     * @return Programs
     */
    public function setSaturday($saturday)
    {
        $this->saturday = $saturday;

        return $this;
    }

    /**
     * Get saturday
     *
     * @return bool
     */
    public function getSaturday()
    {
        return $this->saturday;
    }

    /**
     * Set sunday
     *
     * @param boolean $sunday
     *
     * @return Programs
     */
    public function setSunday($sunday)
    {
        $this->sunday = $sunday;

        return $this;
    }

    /**
     * Get sunday
     *
     * @return bool
     */
    public function getSunday()
    {
        return $this->sunday;
    }

    /**
     * Set timeSlotStart
     *
     * @param \DateTime $timeSlotStart
     *
     * @return Programs
     */
    public function setTimeSlotStart($timeSlotStart)
    {
        $this->timeSlotStart = $timeSlotStart;

        return $this;
    }

    /**
     * Get timeSlotStart
     *
     * @return \DateTime
     */
    public function getTimeSlotStart()
    {
        return $this->timeSlotStart;
    }

    /**
     * Set timeSlotEnd
     *
     * @param \DateTime $timeSlotEnd
     *
     * @return Programs
     */
    public function setTimeSlotEnd($timeSlotEnd)
    {
        $this->timeSlotEnd = $timeSlotEnd;

        return $this;
    }

    /**
     * Get timeSlotEnd
     *
     * @return \DateTime
     */
    public function getTimeSlotEnd()
    {
        return $this->timeSlotEnd;
    }

    /**
     * Set spotLength
     *
     * @param integer $spotLength
     *
     * @return Programs
     */
    public function setSpotLength($spotLength)
    {
        $this->spotLength = $spotLength;

        return $this;
    }

    /**
     * Get spotLength
     *
     * @return int
     */
    public function getSpotLength()
    {
        return $this->spotLength;
    }

    /**
     * Set spotRate
     *
     * @param float $spotRate
     *
     * @return Programs
     */
    public function setSpotRate($spotRate)
    {
        $this->spotRate = $spotRate;

        return $this;
    }

    /**
     * Get spotRate
     *
     * @return float
     */
    public function getSpotRate()
    {
        return $this->spotRate;
    }

    /**
     * Set breakCode
     *
     * @param string $breakCode
     *
     * @return Programs
     */
    public function setBreakCode($breakCode)
    {
        $this->breakCode = $breakCode;

        return $this;
    }

    /**
     * Get breakCode
     *
     * @return string
     */
    public function getBreakCode()
    {
        return $this->breakCode;
    }

    /**
     * Set comment
     *
     * @param string $comment
     *
     * @return Programs
     */
    public function setComment($comment)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment
     *
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Programs
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return Programs
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
}

