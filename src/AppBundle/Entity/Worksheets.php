<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Worksheets
 *
 * @ORM\Table(name="worksheets")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\WorksheetsRepository")
 */
class Worksheets
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
     * @ORM\Column(name="spot_type_id", type="integer")
     * @Assert\NotBlank()
     */
    private $spotTypeId;

    /**
     * @var int
     *
     * @ORM\Column(name="campaign_id", type="integer")
     * @Assert\NotBlank()
     */
    private $campaignId;

    /**
     * @var int
     *
     * @ORM\Column(name="organization_id", type="integer")
     * @Assert\NotBlank()
     */
    private $organizationId;

    /**
     * @var int
     *
     * @ORM\Column(name="region_id", type="integer")
     * @Assert\NotBlank()
     */
    private $regionId;

    /**
     * @var string
     *
     * @ORM\Column(name="week_information", type="text")
     * @Assert\NotBlank()
     */
    private $weekInformation;

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
     * @return Worksheets
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
     * Set spotTypeId
     *
     * @param integer $spotTypeId
     *
     * @return Worksheets
     */
    public function setSpotTypeId($spotTypeId)
    {
        $this->spotTypeId = $spotTypeId;

        return $this;
    }

    /**
     * Get spotTypeId
     *
     * @return int
     */
    public function getSpotTypeId()
    {
        return $this->spotTypeId;
    }

    /**
     * Set campaignId
     *
     * @param integer $campaignId
     *
     * @return Worksheets
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;

        return $this;
    }

    /**
     * Get campaignId
     *
     * @return int
     */
    public function getCampaignId()
    {
        return $this->campaignId;
    }

    /**
     * Set organizationId
     *
     * @param integer $organizationId
     *
     * @return Worksheets
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
     * Set regionId
     *
     * @param integer $regionId
     *
     * @return Worksheets
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
     * Set weekInformation
     *
     * @param string $weekInformation
     *
     * @return Worksheets
     */
    public function setWeekInformation($weekInformation)
    {
        $this->weekInformation = $weekInformation;

        return $this;
    }

    /**
     * Get weekInformation
     *
     * @return string
     */
    public function getWeekInformation()
    {
        return $this->weekInformation;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Worksheets
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
     * @return Worksheets
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

