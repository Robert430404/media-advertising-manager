<?php

namespace AppBundle\Repository;

use \Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

/**
 * Class UsersRepository
 * @package AppBundle\Repository
 */
class UsersRepository extends EntityRepository implements UserLoaderInterface
{
    /**
     * Allows Loading Of Users By Email Or Username
     *
     * @param string $username
     * @return mixed
     */
    public function loadUserByUsername($username)
    {
        $user = $this->createQueryBuilder('u')
            ->where('u.username = :username OR u.email = :email')
            ->setParameter('username', $username)
            ->setParameter('email', $username)
            ->getQuery()
            ->getOneOrNullResult();

        return $user;
    }
}
