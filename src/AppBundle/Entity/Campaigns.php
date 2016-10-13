<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Campaigns
 *
 * @ORM\Table(name="campaigns")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CampaignsRepository")
 */
class Campaigns
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
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     * @Assert\NotBlank()
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="region_id", type="integer")
     * @Assert\NotBlank()
     */
    private $regionId;

    /**
     * @var int
     *
     * @ORM\Column(name="organization_id", type="integer")
     * @Assert\NotBlank()
     */
    private $organizationId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="flight_start_date", type="datetime")
     * @Assert\NotBlank()
     */
    private $flightStartDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="flight_end_date", type="datetime")
     * @Assert\NotBlank()
     */
    private $flightEndDate;

    /**
     * @var int
     *
     * @ORM\Column(name="flight_length", type="integer")
     * @Assert\NotBlank()
     */
    private $flightLength;

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
     * @return Campaigns
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
     * Set regionId
     *
     * @param integer $regionId
     *
     * @return Campaigns
     */
    public function setRegionId($regionId)
    {
        $this->regionId = $regionId;

        return $this;
    }

    /**
     * Get regionId
     *
     * @return int
     */
    public function getRegionId()
    {
        return $this->regionId;
    }

    /**
     * Set organizationId
     *
     * @param integer $organizationId
     *
     * @return Campaigns
     */
    public function setOrganizationId($organizationId)
    {
        $this->organizationId = $organizationId;

        return $this;
    }

    /**
     * Get organizationId
     *
     * @return int
     */
    public function getOrganizationId()
    {
        return $this->organizationId;
    }

    /**
     * Set flightStartDate
     *
     * @param \DateTime $flightStartDate
     *
     * @return Campaigns
     */
    public function setFlightStartDate($flightStartDate)
    {
        $this->flightStartDate = $flightStartDate;

        return $this;
    }

    /**
     * Get flightStartDate
     *
     * @return \DateTime
     */
    public function getFlightStartDate()
    {
        return $this->flightStartDate;
    }

    /**
     * Set flightEndDate
     *
     * @param \DateTime $flightEndDate
     *
     * @return Campaigns
     */
    public function setFlightEndDate($flightEndDate)
    {
        $this->flightEndDate = $flightEndDate;

        return $this;
    }

    /**
     * Get flightEndDate
     *
     * @return \DateTime
     */
    public function getFlightEndDate()
    {
        return $this->flightEndDate;
    }

    /**
     * Set flightLength
     *
     * @param integer $flightLength
     *
     * @return Campaigns
     */
    public function setFlightLength($flightLength)
    {
        $this->flightLength = $flightLength;

        return $this;
    }

    /**
     * Get flightLength
     *
     * @return int
     */
    public function getFlightLength()
    {
        return $this->flightLength;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Campaigns
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
     * @return Campaigns
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

