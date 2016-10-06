<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Program
 *
 * @ORM\Table(name="program")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProgramRepository")
 */
class Program
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
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="worksheet_id", type="integer")
     */
    private $worksheetId;

    /**
     * @var string
     *
     * @ORM\Column(name="day_part", type="string", length=255)
     */
    private $dayPart;

    /**
     * @var string
     *
     * @ORM\Column(name="station", type="string", length=255)
     */
    private $station;

    /**
     * @var string
     *
     * @ORM\Column(name="network", type="string", length=255)
     */
    private $network;

    /**
     * @var string
     *
     * @ORM\Column(name="program", type="string", length=255)
     */
    private $program;

    /**
     * @var string
     *
     * @ORM\Column(name="time_slot_start", type="time")
     */
    private $timeSlotStart;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="time_slot_end", type="time")
     */
    private $timeSlotEnd;

    /**
     * @var int
     *
     * @ORM\Column(name="spot_length", type="integer")
     */
    private $spotLength;

    /**
     * @var float
     *
     * @ORM\Column(name="spot_rate", type="float")
     */
    private $spotRate;

    /**
     * @var string
     *
     * @ORM\Column(name="break_code", type="string", length=255)
     */
    private $breakCode;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="text")
     */
    private $comment;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime")
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * Set timeSlotStart
     *
     * @param \DateTime $timeSlotStart
     *
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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
     * @return Program
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

