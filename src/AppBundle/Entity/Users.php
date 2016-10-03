<?php

namespace AppBundle\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * Class Users
 * @package AppBundle\Entity
 *
 * @ORM\Entity
 * @UniqueEntity("email_address")
 * @UniqueEntity("username")
 * @ORM\Table(name="users")
 */
class Users implements UserInterface
{
    /**
     * @var integer
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */

    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=100, unique=true)
     * @Assert\NotBlank()
     */
    private $username;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     * @Assert\Length(max=4096)
     */
    private $password;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    private $user_role;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=100, unique=true)
     * @Assert\NotBlank()
     * @Assert\Email()
     */
    private $email_address;

    /**
     * @var object
     *
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank()
     */
    private $created_at;

    /**
     * @var object
     *
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank()
     */
    private $updated_at;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return Users
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return Users
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set userRole
     *
     * @param string $userRole
     *
     * @return Users
     */
    public function setUserRole($userRole)
    {
        $this->user_role = $userRole;

        return $this;
    }

    /**
     * Get userRole
     *
     * @return string
     */
    public function getUserRole()
    {
        return $this->user_role;
    }

    /**
     * Set emailAddress
     *
     * @param string $emailAddress
     *
     * @return Users
     */
    public function setEmailAddress($emailAddress)
    {
        $this->email_address = $emailAddress;

        return $this;
    }

    /**
     * Get emailAddress
     *
     * @return string
     */
    public function getEmailAddress()
    {
        return $this->email_address;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Users
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return Users
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updated_at = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * Stub For Interface Compatibility
     *
     * @return (Role|string)[] The user roles
     */
    public function getRoles()
    {
        return $this->getUserRole();
    }

    /**
     * Returns the salt that was originally used to encode the password.
     * @return string|null The salt
     */
    public function getSalt()
    {
        return null;
    }

    /**
     * Stub For Interface Compatibility
     *
     * @return string|null The salt
     */
    public function eraseCredentials()
    {
        return null;
    }
}
